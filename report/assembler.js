// report/assembler.js
'use strict';

function assembleReport({ intake, plan, results, lang }) {
  return {
    success: true,
    caseId: plan.caseId,
    activePatterns: plan.activePatterns,
    executeModules: plan.executeModules,
    results,
  };
}

module.exports = { assembleReport };
