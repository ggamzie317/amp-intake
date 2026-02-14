'use strict';

const { SOT, resolveLang } = require('../config/sot');

/**
 * Very small template renderer.
 * Tokens: {moduleId}, {modeLabel}
 */
function renderTemplate(template, vars) {
  return template.replace(/\{(\w+)\}/g, (_, key) => {
    const v = vars[key];
    return v === undefined || v === null ? '' : String(v);
  });
}

function modeToLabelKey(mode) {
  return mode === 'production' ? 'MODE_PRODUCTION' : 'MODE_SIMULATION';
}

function getMessageTemplate(messageKey, lang) {
  const safeLang = resolveLang(lang);
  const msg = SOT.messages[messageKey];
  if (!msg) {
    // Fallback: return messageKey itself if missing
    return `[${messageKey}]`;
  }
  return msg[safeLang] || msg[SOT.global.defaultLang] || `[${messageKey}]`;
}

/**
 * Render message by messageKey + vars
 */
function renderMessage(messageKey, vars, lang) {
  const template = getMessageTemplate(messageKey, lang);
  return renderTemplate(template, vars || {});
}

/**
 * Create standard module result object (module-level status, NOT HTTP status)
 */
function makeModuleResult({ moduleId, statusKey, messageKey, lang, mode, data }) {
  const safeLang = resolveLang(lang);
  const modeLabelKey = modeToLabelKey(mode);
  const modeLabel = renderMessage(modeLabelKey, {}, safeLang);

  const message = renderMessage(
    messageKey,
    { moduleId, modeLabel },
    safeLang
  );

  return {
    status: statusKey,          // keep existing field name: "status"
    messageKey,                 // new: stable key for tests
    message,
    data: data ?? null,
  };
}

/**
 * Standard "unimplemented" result for any module
 */
function makeUnimplementedResult(moduleId, lang, mode) {
  return makeModuleResult({
    moduleId,
    statusKey: SOT.global.unimplementedStatusKey,
    messageKey: 'MODULE_NOT_IMPLEMENTED',
    lang,
    mode: mode || 'simulation',
    data: null,
  });
}

module.exports = {
  renderMessage,
  makeModuleResult,
  makeUnimplementedResult,
};
