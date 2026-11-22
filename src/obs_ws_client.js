const crypto = require('crypto');
const WebSocket = require('ws');
const { EventEmitter } = require('events');

/**
 * Lightweight OBS Studio WebSocket v5 (v5.0+) client using `ws` + Node `crypto`.
 * Supports password authentication, scene switching, stream/record toggles,
 * replay buffer saving, and mic mute toggling.
 */
class ObsWsClient extends EventEmitter {
  constructor() {
    super();
    this.ws = null;
    this.reqCounter = 1;
    this.pending = new Map();
    this.state = {
      connected: false,
      connecting: false,
      error: '',
      currentScene: '',
      scenes: [],
      streamActive: false,
      recordActive: false,
      replayActive: false,
      micName: '',
      micMuted: false
    };
    this.lastOpts = null;
  }

  getState() {
    return { ...this.state };
  }

  _updateState(patch) {
    this.state = { ...this.state, ...patch };
    this.emit('state', this.getState());
  }

  async connect({ host = '127.0.0.1', port = 4455, password = '', micName = '' } = {}) {
    this.disconnect(false);
    this.lastOpts = {
      host: String(host || '127.0.0.1').trim(),
      port: parseInt(port, 10) || 4455,
      password: String(password || ''),
      micName: String(micName || '').trim()
    };

    this._updateState({ connecting: true, error: '' });
    const url = `ws://${this.lastOpts.host}:${this.lastOpts.port}`;

    return new Promise((resolve, reject) => {
      let settled = false;
      const done = (err, val) => {
        if (settled) return;
        settled = true;
        if (err) reject(err);
        else resolve(val);
      };

      const ws = new WebSocket(url);
      this.ws = ws;

      ws.on('message', async (raw) => {
        let msg;
        try {
          msg = JSON.parse(raw.toString());
        } catch (e) {
          return;
        }

        if (msg.op === 0) {
          // Hello -> send Identify (op 1)
          const identifyData = { rpcVersion: 1 };
          if (msg.d?.authentication) {
            const { challenge, salt } = msg.d.authentication;
            const secret = crypto
              .createHash('sha256')
              .update(this.lastOpts.password + salt)
              .digest('base64');
            identifyData.authentication = crypto
              .createHash('sha256')
              .update(secret + challenge)
              .digest('base64');
          }
          ws.send(JSON.stringify({ op: 1, d: identifyData }));
        } else if (msg.op === 2) {
          // Identified
          this._updateState({ connected: true, connecting: false, error: '' });
          await this.refreshState().catch(() => {});
          done(null, { ok: true, state: this.getState() });
        } else if (msg.op === 5) {
          this._handleObsEvent(msg.d);
        } else if (msg.op === 7) {
          const id = msg.d?.requestId;
          const entry = this.pending.get(id);
          if (entry) {
            clearTimeout(entry.timer);
            this.pending.delete(id);
            if (msg.d.requestStatus?.result) {
              entry.resolve(msg.d.responseData || {});
            } else {
              entry.reject(
                new Error(msg.d.requestStatus?.comment || `OBS Fehler Code ${msg.d.requestStatus?.code}`)
              );
            }
          }
        }
      });

      ws.on('error', (err) => {
        const errMsg = err?.message || 'OBS WebSocket Verbindungsfehler';
        this._updateState({ connected: false, connecting: false, error: errMsg });
        done(new Error(errMsg));
      });

      ws.on('close', (code) => {
        const wasConnected = this.state.connected;
        for (const entry of this.pending.values()) {
          clearTimeout(entry.timer);
          entry.reject(new Error('OBS WebSocket Verbindung geschlossen.'));
        }
        this.pending.clear();
        const closeErr = !wasConnected && code === 4009 ? 'Falsches OBS WebSocket-Passwort.' : '';
        this._updateState({
          connected: false,
          connecting: false,
          error: closeErr || this.state.error
        });
        if (!settled) {
          done(new Error(closeErr || `OBS WebSocket getrennt (Code ${code})`));
        }
      });
    });
  }

  _handleObsEvent(d) {
    if (!d) return;
    const { eventType, eventData } = d;
    if (eventType === 'CurrentProgramSceneChanged' && eventData?.sceneName) {
      this._updateState({ currentScene: eventData.sceneName });
    } else if (eventType === 'SceneListChanged' && Array.isArray(eventData?.scenes)) {
      this._updateState({
        scenes: eventData.scenes.map((s) => s.sceneName).reverse()
      });
    } else if (eventType === 'StreamStateChanged') {
      this._updateState({ streamActive: Boolean(eventData?.outputActive) });
    } else if (eventType === 'RecordStateChanged') {
      this._updateState({ recordActive: Boolean(eventData?.outputActive) });
    } else if (eventType === 'ReplayBufferStateChanged') {
      this._updateState({ replayActive: Boolean(eventData?.outputActive) });
    } else if (
      eventType === 'InputMuteStateChanged' &&
      eventData?.inputName &&
      eventData.inputName === this.state.micName
    ) {
      this._updateState({ micMuted: Boolean(eventData.inputMuted) });
    }
  }

  call(requestType, requestData = undefined) {
    if (!this.ws || this.ws.readyState !== WebSocket.OPEN || !this.state.connected) {
      return Promise.reject(new Error('Nicht mit OBS WebSocket v5 verbunden.'));
    }
    const requestId = String(this.reqCounter++);
    return new Promise((resolve, reject) => {
      const timer = setTimeout(() => {
        this.pending.delete(requestId);
        reject(new Error(`OBS Anfrage Timeout (${requestType})`));
      }, 6000);
      this.pending.set(requestId, { resolve, reject, timer });
      const payload = { op: 6, d: { requestType, requestId } };
      if (requestData !== undefined) payload.d.requestData = requestData;
      this.ws.send(JSON.stringify(payload));
    });
  }

  async refreshState() {
    if (!this.state.connected) return this.getState();
    const patch = {};
    try {
      const sceneRes = await this.call('GetSceneList');
      patch.currentScene = sceneRes.currentProgramSceneName || '';
      patch.scenes = Array.isArray(sceneRes.scenes)
        ? sceneRes.scenes.map((s) => s.sceneName).reverse()
        : [];
    } catch (e) {}

    try {
      const stRes = await this.call('GetStreamStatus');
      patch.streamActive = Boolean(stRes.outputActive);
    } catch (e) {}

    try {
      const recRes = await this.call('GetRecordStatus');
      patch.recordActive = Boolean(recRes.outputActive);
    } catch (e) {}

    try {
      const repRes = await this.call('GetReplayBufferStatus');
      patch.replayActive = Boolean(repRes.outputActive);
    } catch (e) {
      patch.replayActive = false;
    }

    let micName = this.lastOpts?.micName || '';
    if (!micName) {
      try {
        const sp = await this.call('GetSpecialInputs');
        micName = sp.mic1 || sp.mic2 || '';
      } catch (e) {}
    }
    if (micName) {
      patch.micName = micName;
      try {
        const muteRes = await this.call('GetInputMute', { inputName: micName });
        patch.micMuted = Boolean(muteRes.inputMuted);
      } catch (e) {}
    }

    this._updateState(patch);
    return this.getState();
  }

  async setScene(sceneName) {
    if (!sceneName) throw new Error('Kein Szenenname angegeben.');
    await this.call('SetCurrentProgramScene', { sceneName: String(sceneName) });
    this._updateState({ currentScene: String(sceneName) });
    return { ok: true, currentScene: String(sceneName) };
  }

  async toggleStream() {
    const res = await this.call('ToggleStream');
    this._updateState({ streamActive: Boolean(res.outputActive) });
    return { ok: true, streamActive: Boolean(res.outputActive) };
  }

  async toggleRecord() {
    const res = await this.call('ToggleRecord');
    this._updateState({ recordActive: Boolean(res.outputActive) });
    return { ok: true, recordActive: Boolean(res.outputActive) };
  }

  async saveReplayBuffer() {
    await this.call('SaveReplayBuffer');
    return { ok: true };
  }

  async toggleMicMute(inputName = '') {
    const target = String(inputName || this.state.micName || '').trim();
    if (!target) {
      throw new Error('Kein OBS-Mikrofon gefunden (in OBS Config optional Namen angeben).');
    }
    const res = await this.call('ToggleInputMute', { inputName: target });
    this._updateState({ micName: target, micMuted: Boolean(res.inputMuted) });
    return { ok: true, micName: target, micMuted: Boolean(res.inputMuted) };
  }

  async getSceneItems(sceneName = '') {
    const target = String(sceneName || this.state.currentScene || '').trim();
    if (!target) throw new Error('Keine Szene ausgewählt.');
    let baseWidth = 1920;
    let baseHeight = 1080;
    try {
      const vs = await this.call('GetVideoSettings');
      if (vs?.baseWidth) baseWidth = Number(vs.baseWidth);
      if (vs?.baseHeight) baseHeight = Number(vs.baseHeight);
    } catch (e) {}

    const res = await this.call('GetSceneItemList', { sceneName: target });
    const items = (Array.isArray(res.sceneItems) ? res.sceneItems : []).map((it) => ({
      sceneItemId: it.sceneItemId,
      sourceName: it.sourceName,
      inputKind: it.inputKind || '',
      sceneItemEnabled: Boolean(it.sceneItemEnabled),
      sceneItemLocked: Boolean(it.sceneItemLocked),
      transform: it.sceneItemTransform || {}
    }));
    return { ok: true, sceneName: target, baseWidth, baseHeight, items: items.reverse() };
  }

  async setSceneItemEnabled(sceneName, sceneItemId, enabled) {
    await this.call('SetSceneItemEnabled', {
      sceneName: String(sceneName),
      sceneItemId: Number(sceneItemId),
      sceneItemEnabled: Boolean(enabled)
    });
    return { ok: true };
  }

  async setSceneItemTransform(sceneName, sceneItemId, transform = {}) {
    await this.call('SetSceneItemTransform', {
      sceneName: String(sceneName),
      sceneItemId: Number(sceneItemId),
      sceneItemTransform: transform
    });
    return { ok: true };
  }

  async createScene(sceneName) {
    const clean = String(sceneName || '').trim();
    if (!clean) throw new Error('Bitte Szenennamen angeben.');
    await this.call('CreateScene', { sceneName: clean });
    await this.refreshState();
    return { ok: true, sceneName: clean };
  }

  async getAudioInputs() {
    const res = await this.call('GetInputList');
    const inputs = Array.isArray(res.inputs) ? res.inputs : [];
    const audioList = [];
    for (const inp of inputs) {
      try {
        const vol = await this.call('GetInputVolume', { inputName: inp.inputName });
        const mute = await this.call('GetInputMute', { inputName: inp.inputName });
        audioList.push({
          inputName: inp.inputName,
          inputKind: inp.inputKind || '',
          volumeMul: typeof vol.inputVolumeMul === 'number' ? vol.inputVolumeMul : 1,
          volumeDb: typeof vol.inputVolumeDb === 'number' ? vol.inputVolumeDb : 0,
          muted: Boolean(mute.inputMuted)
        });
      } catch (e) {
        // Input has no audio track (e.g. pure Image/Color source) — skip
      }
    }
    return { ok: true, inputs: audioList };
  }

  async setInputVolume(inputName, volumeMul) {
    const mul = Math.max(0, Math.min(2, Number(volumeMul)));
    await this.call('SetInputVolume', { inputName: String(inputName), inputVolumeMul: mul });
    return { ok: true, inputName, volumeMul: mul };
  }

  async getSceneScreenshot(sceneName = '') {
    const target = String(sceneName || this.state.currentScene || '').trim();
    if (!target) throw new Error('Keine Szene ausgewählt.');
    const res = await this.call('GetSourceScreenshot', {
      sourceName: target,
      imageFormat: 'jpg',
      imageWidth: 640,
      imageHeight: 360,
      imageCompressionQuality: 70
    });
    return { ok: true, imageData: res.imageData || '' };
  }

  async getInputKinds() {
    const res = await this.call('GetInputKindList', { unversioned: false });
    return { ok: true, kinds: Array.isArray(res.inputKinds) ? res.inputKinds : [] };
  }

  async createInput({ sceneName, inputName, inputKind, inputSettings = {} }) {
    const targetScene = String(sceneName || this.state.currentScene || '').trim();
    const name = String(inputName || '').trim();
    const kind = String(inputKind || '').trim();
    if (!targetScene || !name || !kind) {
      throw new Error('Szene, Quellenname und Quelltyp sind erforderlich.');
    }
    const res = await this.call('CreateInput', {
      sceneName: targetScene,
      inputName: name,
      inputKind: kind,
      inputSettings,
      sceneItemEnabled: true
    });
    return { ok: true, sceneItemId: res.sceneItemId, inputName: name };
  }

  async removeSceneItem(sceneName, sceneItemId) {
    await this.call('RemoveSceneItem', {
      sceneName: String(sceneName || this.state.currentScene),
      sceneItemId: Number(sceneItemId)
    });
    return { ok: true };
  }

  async startVirtualCam() {
    let wasActive = false;
    try {
      const st = await this.call('GetVirtualCamStatus');
      wasActive = Boolean(st.outputActive);
    } catch (e) {}
    if (!wasActive) {
      await this.call('StartVirtualCam');
    }
    return { ok: true, startedByEditor: !wasActive };
  }

  async stopVirtualCam() {
    try {
      const st = await this.call('GetVirtualCamStatus');
      if (st.outputActive) {
        await this.call('StopVirtualCam');
      }
    } catch (e) {}
    return { ok: true };
  }

  async getInputSettings(inputName) {
    const res = await this.call('GetInputSettings', { inputName });
    return {
      inputKind: res.inputKind || '',
      inputSettings: res.inputSettings || {}
    };
  }

  async setInputSettings(inputName, inputSettings, overlay = true) {
    await this.call('SetInputSettings', { inputName, inputSettings, overlay });
    return { ok: true };
  }

  async getInputPropertyItems(inputName, propertyName) {
    try {
      const res = await this.call('GetInputPropertiesListPropertyItems', { inputName, propertyName });
      return res.propertyItems || [];
    } catch (e) {
      return null;
    }
  }

  async inspectInputProperties(inputName) {
    const { inputKind, inputSettings } = await this.getInputSettings(inputName);
    const candidateProps = ['type', 'window', 'application', 'display_uuid', 'display', 'device', 'device_id'];
    const properties = {};
    for (const prop of candidateProps) {
      const items = await this.getInputPropertyItems(inputName, prop);
      if (Array.isArray(items) && items.length > 0) {
        properties[prop] = items;
      }
    }
    return { inputKind, inputSettings, properties };
  }

  disconnect(emitUpdate = true) {
    for (const entry of this.pending.values()) {
      clearTimeout(entry.timer);
      entry.reject(new Error('Verbindung getrennt.'));
    }
    this.pending.clear();
    if (this.ws) {
      try {
        this.ws.removeAllListeners();
        this.ws.close();
      } catch (e) {}
      this.ws = null;
    }
    if (emitUpdate) {
      this._updateState({
        connected: false,
        connecting: false,
        error: '',
        scenes: [],
        currentScene: ''
      });
    }
  }
}

module.exports = { ObsWsClient };
