'use strict';

async function verifyReport({ reportJson, asOf }) {
  // TODO: Integrate with Vertex AI Gemini Flash using @google-cloud/vertexai SDK.
  // TODO: Authenticate with GOOGLE_APPLICATION_CREDENTIALS for service-account access.
  // TODO: Pass full report payload + asOf into a structured verification prompt.
  void reportJson;
  void asOf;

  return {
    status: 'ok',
    notes: [],
    riskFlags: [],
    checkedAt: new Date().toISOString(),
    model: 'gemini-flash-stub',
  };
}

module.exports = { verifyReport };
