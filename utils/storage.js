'use strict';

async function uploadReport(caseId, html) {
  // TODO: Upload rendered report to a GCS bucket.
  // TODO: Generate signed URL for secure client delivery.
  void html;
  return { url: `https://storage.stub/${caseId}.html` };
}

module.exports = { uploadReport };
