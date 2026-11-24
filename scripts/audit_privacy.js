#!/usr/bin/env node
const path = require('path');
const { runPrivacyAudit } = require('../src/privacy_audit');

const res = runPrivacyAudit(path.join(__dirname, '..', 'src'));
console.log(`🔒 OmniGrid Studio — Zero-Telemetry & Domain Audit`);
console.log(`   Geprüfte Quellcode-Dateien: ${res.scannedFiles}`);
console.log(`   Geprüfte Endpunkt-Referenzen: ${res.totalEndpoints}`);
if (!res.ok) {
  console.error(`❌ Nicht erlaubte Domains gefunden:`, res.unknownEndpoints);
  process.exit(1);
}
console.log(`✅ ZERO-TELEMETRY AUDIT BESTANDEN: 0 fremde Server, 0 Tracker, 100% direkte offizielle APIs.`);
