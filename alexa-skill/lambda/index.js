const Alexa = require('ask-sdk-core');
const { DynamoDbPersistenceAdapter } = require('ask-sdk-dynamodb-persistence-adapter');

const RELAY_BASE_URL = String(process.env.OMNIGRID_RELAY_URL || '').replace(/\/+$/, '');
const REQUEST_TIMEOUT_MS = 4000;

const STRINGS = {
  de: {
    launch: 'Willkommen bei OmniGrid Studio. Sage zum Beispiel: Mach einen Clip, Hype auslösen, Starte Multistream oder Kopple Code gefolgt von deinem sechsstelligen Code.',
    help: 'Du kannst sagen: Kopple Code 739412, Mach einen Clip, Hype auslösen, Starte Multistream, Stoppe Multistream, Mikrofon umschalten oder Starte Umfrage.',
    stop: 'Bis bald bei OmniGrid Studio.',
    unconfigured: 'Der OmniGrid Relay-Server ist im Skill noch nicht konfiguriert.',
    notPaired: 'Dein OmniGrid Studio ist noch nicht gekoppelt. Öffne in OmniGrid die Sprachsteuerung, generiere einen sechsstelligen Code und sage: Kopple Code gefolgt von den Ziffern.',
    invalidCode: 'Ich habe keinen gültigen sechsstelligen Pairing-Code verstanden. Bitte wiederhole ihn.',
    pairOk: 'Perfekt! Dein OmniGrid Studio ist jetzt dauerhaft gekoppelt. Du kannst ab sofort direkt Sprachbefehle geben.',
    pairFail: 'Der Pairing-Code ist ungültig oder abgelaufen. Bitte generiere in OmniGrid einen neuen Code.',
    offline: 'OmniGrid Studio hat nicht rechtzeitig geantwortet. Prüfe, ob die App auf deinem Rechner geöffnet ist.',
    sentOk: {
      clip: 'Clip, Marker und Replay wurden in OmniGrid ausgelöst.',
      hype: 'Chat-Hype-Detektor wurde ausgelöst.',
      multistream_start: 'Multi-Plattform-Stream wird gestartet.',
      multistream_stop: 'Multi-Plattform-Stream wird gestoppt.',
      mute_toggle: 'Mikrofon wurde umgeschaltet.',
      poll_start: 'Umfrage wurde im Stream gestartet.'
    },
    sentQueued: 'Befehl wurde an OmniGrid gesendet. Falls die App gerade geschlossen ist, starte sie bitte.',
    error: 'Es ist ein Fehler aufgetreten. Bitte versuche es gleich noch einmal.'
  },
  en: {
    launch: 'Welcome to OmniGrid Studio. Try saying: Make a clip, Trigger hype, Start multistream, or Pair code followed by your six-digit code.',
    help: 'You can say: Pair code 739412, Make a clip, Trigger hype, Start multistream, Stop multistream, Toggle mic, or Start poll.',
    stop: 'Goodbye from OmniGrid Studio.',
    unconfigured: 'The OmniGrid relay server is not configured in this skill yet.',
    notPaired: 'Your OmniGrid Studio is not paired yet. Generate a six-digit pairing code in OmniGrid Voice Control and say: Pair code followed by the digits.',
    invalidCode: 'I did not hear a valid six-digit pairing code. Please try again.',
    pairOk: 'Great! Your OmniGrid Studio is now permanently paired. You can use voice commands right away.',
    pairFail: 'That pairing code is invalid or expired. Please generate a new code in OmniGrid.',
    offline: 'OmniGrid Studio did not respond in time. Please check that the desktop app is running.',
    sentOk: {
      clip: 'Clip, stream marker, and replay buffer triggered in OmniGrid.',
      hype: 'Chat hype detector triggered.',
      multistream_start: 'Starting multi-platform stream.',
      multistream_stop: 'Stopping multi-platform stream.',
      mute_toggle: 'Microphone mute toggled.',
      poll_start: 'Stream poll started.'
    },
    sentQueued: 'Command sent to OmniGrid. Make sure the desktop app is open.',
    error: 'Something went wrong. Please try again shortly.'
  }
};

function getTexts(handlerInput) {
  const locale = String(handlerInput.requestEnvelope?.request?.locale || 'de-DE').toLowerCase();
  return locale.startsWith('en') ? STRINGS.en : STRINGS.de;
}

async function fetchJsonWithTimeout(url, options = {}) {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), REQUEST_TIMEOUT_MS);
  try {
    const res = await fetch(url, {
      ...options,
      signal: controller.signal,
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {})
      }
    });
    const data = await res.json().catch(() => ({}));
    return { ok: res.ok, status: res.status, data };
  } finally {
    clearTimeout(timer);
  }
}

async function dispatchRelayCommand(handlerInput, action, payload = {}) {
  const t = getTexts(handlerInput);
  if (!RELAY_BASE_URL) {
    return handlerInput.responseBuilder.speak(t.unconfigured).getResponse();
  }
  const attrs = (await handlerInput.attributesManager.getPersistentAttributes()) || {};
  if (!attrs.channelId || !attrs.writeToken) {
    return handlerInput.responseBuilder.speak(t.notPaired).reprompt(t.notPaired).getResponse();
  }

  try {
    const res = await fetchJsonWithTimeout(`${RELAY_BASE_URL}/command/${encodeURIComponent(attrs.channelId)}`, {
      method: 'POST',
      headers: { Authorization: `Bearer ${attrs.writeToken}` },
      body: JSON.stringify({ action, payload, assistant: 'alexa', waitAckMs: 2500 })
    });
    if (!res.ok) {
      const msg = res.status === 401 || res.status === 404 ? t.notPaired : t.offline;
      return handlerInput.responseBuilder.speak(msg).getResponse();
    }
    const speech = res.data?.delivered
      ? (res.data?.ack?.message || t.sentOk[action] || t.sentQueued)
      : t.sentQueued;
    return handlerInput.responseBuilder.speak(speech).getResponse();
  } catch (err) {
    return handlerInput.responseBuilder.speak(t.offline).getResponse();
  }
}

const LaunchRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'LaunchRequest';
  },
  handle(handlerInput) {
    const t = getTexts(handlerInput);
    return handlerInput.responseBuilder.speak(t.launch).reprompt(t.help).getResponse();
  }
};

const PairDeviceIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'PairDeviceIntent'
    );
  },
  async handle(handlerInput) {
    const t = getTexts(handlerInput);
    if (!RELAY_BASE_URL) {
      return handlerInput.responseBuilder.speak(t.unconfigured).getResponse();
    }
    const rawCode = Alexa.getSlotValue(handlerInput.requestEnvelope, 'pairingCode') || '';
    const cleanCode = String(rawCode).toUpperCase().replace(/[^A-Z0-9]/g, '');
    if (cleanCode.length < 6) {
      return handlerInput.responseBuilder.speak(t.invalidCode).reprompt(t.invalidCode).getResponse();
    }

    const userId = handlerInput.requestEnvelope?.session?.user?.userId || 'alexa-user';
    try {
      const res = await fetchJsonWithTimeout(`${RELAY_BASE_URL}/pair/claim`, {
        method: 'POST',
        body: JSON.stringify({ pairingCode: cleanCode, assistant: 'alexa', userId })
      });
      if (!res.ok || !res.data?.channelId || !res.data?.writeToken) {
        return handlerInput.responseBuilder.speak(t.pairFail).getResponse();
      }
      handlerInput.attributesManager.setPersistentAttributes({
        channelId: res.data.channelId,
        writeToken: res.data.writeToken,
        pairedAt: Date.now()
      });
      await handlerInput.attributesManager.savePersistentAttributes();
      return handlerInput.responseBuilder.speak(t.pairOk).getResponse();
    } catch (err) {
      return handlerInput.responseBuilder.speak(t.offline).getResponse();
    }
  }
};

const CommandIntentMap = {
  ClipIntent: 'clip',
  HypeIntent: 'hype',
  MultiStreamStartIntent: 'multistream_start',
  MultiStreamStopIntent: 'multistream_stop',
  MuteToggleIntent: 'mute_toggle'
};

const ActionIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Boolean(CommandIntentMap[Alexa.getIntentName(handlerInput.requestEnvelope)])
    );
  },
  async handle(handlerInput) {
    const intentName = Alexa.getIntentName(handlerInput.requestEnvelope);
    return dispatchRelayCommand(handlerInput, CommandIntentMap[intentName], {});
  }
};

const PollStartIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'PollStartIntent'
    );
  },
  async handle(handlerInput) {
    const question = String(Alexa.getSlotValue(handlerInput.requestEnvelope, 'question') || '').trim();
    return dispatchRelayCommand(handlerInput, 'poll_start', {
      question: question || 'Gefällt euch der Stream?',
      options: ['Ja', 'Nein']
    });
  }
};

const HelpIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      Alexa.getIntentName(handlerInput.requestEnvelope) === 'AMAZON.HelpIntent'
    );
  },
  handle(handlerInput) {
    const t = getTexts(handlerInput);
    return handlerInput.responseBuilder.speak(t.help).reprompt(t.help).getResponse();
  }
};

const CancelAndStopIntentHandler = {
  canHandle(handlerInput) {
    return (
      Alexa.getRequestType(handlerInput.requestEnvelope) === 'IntentRequest' &&
      ['AMAZON.CancelIntent', 'AMAZON.StopIntent'].includes(Alexa.getIntentName(handlerInput.requestEnvelope))
    );
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.speak(getTexts(handlerInput).stop).getResponse();
  }
};

const SessionEndedRequestHandler = {
  canHandle(handlerInput) {
    return Alexa.getRequestType(handlerInput.requestEnvelope) === 'SessionEndedRequest';
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.getResponse();
  }
};

const ErrorHandler = {
  canHandle() {
    return true;
  },
  handle(handlerInput) {
    return handlerInput.responseBuilder.speak(getTexts(handlerInput).error).getResponse();
  }
};

const persistenceAdapter = new DynamoDbPersistenceAdapter({
  tableName: process.env.DYNAMODB_PERSISTENCE_TABLE_NAME || 'omnigrid-alexa-users',
  createTable: false
});

exports.handler = Alexa.SkillBuilders.custom()
  .addRequestHandlers(
    LaunchRequestHandler,
    PairDeviceIntentHandler,
    ActionIntentHandler,
    PollStartIntentHandler,
    HelpIntentHandler,
    CancelAndStopIntentHandler,
    SessionEndedRequestHandler
  )
  .addErrorHandlers(ErrorHandler)
  .withPersistenceAdapter(persistenceAdapter)
  .lambda();
