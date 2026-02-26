'use strict';

const { renderMessage, resolveLang } = require('../config/sot');
const { getAsOfISO, getAsOfDate } = require('../utils/time');

function assembleReport({ intake, plan, results, lang }) {
  const l = resolveLang(lang);

  const asOfISO = getAsOfISO();
  const asOfDate = getAsOfDate();

  return {
    success: true,
    caseId: plan.caseId,
    activePatterns: plan.activePatterns,
    executeModules: plan.executeModules,
    results,

    messageKey: 'AMP_INTAKE_SUCCESS',
    message: renderMessage('AMP_INTAKE_SUCCESS', {}, l),

    // 🔹 앞으로 confidence / evidence 붙일 자리
    meta: {
      asOf: asOfDate,
      generatedAt: asOfISO,
      lang: l,

      disclaimer:
        l === 'ko'
          ? `본 리포트는 ${asOfDate} 기준 공개 정보 및 검증 가능한 출처를 기반으로 작성되었습니다. 정책은 예고 없이 변경될 수 있으며 최종 결정은 고객에게 있습니다.`
          : `This report is based on publicly available and verifiable sources as of ${asOfDate}. Policies may change without notice, and final decisions remain with the client.`,
    },
  };
}

module.exports = { assembleReport };
