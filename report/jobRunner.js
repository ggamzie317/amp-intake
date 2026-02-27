'use strict';

const { assembleReport } = require('./assembler');
const { renderReportHtml } = require('./renderer');
const { verifyReport } = require('../services/vertexGemini');
const storage = require('../utils/storage');
const mailer = require('../services/mailer');
const { resolveLang } = require('../config/sot');

async function runReportJob({ intake, plan, results }) {
  const lang = resolveLang(intake?.meta?.lang);
  const reportJson = assembleReport({ intake, plan, results, lang });

  const verification = await verifyReport({
    reportJson,
    asOf: reportJson.meta?.asOf,
  });

  reportJson.verification = verification;

  const html = renderReportHtml(reportJson);
  const uploaded = await storage.uploadReport(reportJson.caseId, html);

  await mailer.sendReportEmail({
    to: intake?.meta?.email || '',
    subject: `AMP Report - ${reportJson.caseId}`,
    html,
    links: { reportUrl: uploaded.url },
    meta: reportJson.meta,
  });

  return {
    caseId: reportJson.caseId,
    reportUrl: 'stub-url',
    verificationStatus: verification.status,
  };
}

module.exports = { runReportJob };
