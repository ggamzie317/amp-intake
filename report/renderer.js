'use strict';

function renderReportHtml(reportJson) {
  const safePayload = JSON.stringify(reportJson, null, 2);

  return `<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1" />
    <title>AMP Report ${reportJson.caseId || ''}</title>
  </head>
  <body>
    <h1>AMP Report</h1>
    <pre>${safePayload}</pre>
  </body>
</html>`;
}

module.exports = { renderReportHtml };
