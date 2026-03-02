'use strict';

const { renderMessage, resolveLang } = require('../config/sot');
const { getAsOfISO, getAsOfDate } = require('../utils/time');
const { getTierConfig } = require('../config/tiers');

const DEFAULT_TIER_PRICES = {
  essential: 5,
  strategic: 20,
  executive: 50,
};

const OPTION_ARRAY_KEYS = ['options', 'solutions', 'recommendations'];

function normalizeTierId(value) {
  if (value === null || value === undefined) return null;
  const normalized = String(value).trim().toLowerCase();
  return normalized || null;
}

function normalizeConfidenceStars(value) {
  if (!Number.isFinite(value)) return null;
  return Math.min(5, Math.max(1, Math.round(value)));
}

function isPlaceholderEvidence(evidenceItem) {
  const url = typeof evidenceItem?.url === 'string' ? evidenceItem.url : '';
  const title = typeof evidenceItem?.title === 'string' ? evidenceItem.title : '';
  const notes = typeof evidenceItem?.notes === 'string' ? evidenceItem.notes : '';
  return /example\.com/i.test(url) || /stub/i.test(`${url} ${title} ${notes}`);
}

function summarizeVerification(results) {
  const state = {
    perplexity: { hasTodo: false, hasValue: false, value: '' },
    chatgpt: { hasTodo: false, hasValue: false, value: '' },
    gemini: { hasTodo: false, hasValue: false, value: '' },
  };

  for (const moduleResult of Object.values(results || {})) {
    const verification = moduleResult?.verification;
    if (!verification || typeof verification !== 'object') continue;

    for (const key of Object.keys(state)) {
      const raw = verification[key];
      if (typeof raw !== 'string' || !raw.trim()) continue;
      const value = raw.trim().toLowerCase();
      if (value === 'todo') {
        state[key].hasTodo = true;
      } else if (value !== 'n/a') {
        state[key].hasValue = true;
        if (!state[key].value) state[key].value = value;
      }
    }
  }

  const summary = {};
  for (const key of Object.keys(state)) {
    if (state[key].hasTodo) {
      summary[key] = 'todo';
    } else if (state[key].hasValue) {
      summary[key] = key === 'chatgpt' && state[key].value === 'drafted'
        ? 'drafted'
        : (state[key].value === 'done' ? 'done' : 'done');
    } else {
      summary[key] = 'n/a';
    }
  }

  return summary;
}

function assembleReport({ intake, plan, results, lang }) {
  const l = resolveLang(lang);

  const asOfISO = getAsOfISO();
  const asOfDate = getAsOfDate();
  const tierIdNormalized = normalizeTierId(intake?.meta?.tier);
  const tierConfig = tierIdNormalized ? getTierConfig(tierIdNormalized) : null;
  const tier = tierConfig
    ? {
      id: tierConfig.id,
      displayName: tierConfig.displayName,
      priceUsd: tierConfig.priceUsd ?? DEFAULT_TIER_PRICES[tierConfig.id] ?? null,
      includesAudio: tierConfig.includesAudio,
      includesChatbotDays: tierConfig.includesChatbotDays,
      maxOptionsSuggested: tierConfig.maxOptionsSuggested,
    }
    : null;

  let evidenceCount = 0;
  const confidenceStars = [];
  const confidenceReasons = [];

  for (const moduleResult of Object.values(results || {})) {
    if (!moduleResult || typeof moduleResult !== 'object') continue;

    if (Array.isArray(moduleResult.evidence)) {
      evidenceCount += moduleResult.evidence.length;
      moduleResult.evidence.forEach((item) => {
        if (item && typeof item === 'object' && item.placeholder === undefined && isPlaceholderEvidence(item)) {
          item.placeholder = true;
        }
      });
    }

    const confidence = moduleResult.confidence;
    if (confidence && typeof confidence === 'object') {
      if (confidence.stars === undefined && confidence.overall !== undefined) {
        confidence.stars = confidence.overall;
      }

      const normalizedStars = normalizeConfidenceStars(Number(confidence.stars));
      if (normalizedStars !== null) {
        confidence.stars = normalizedStars;
        confidenceStars.push(normalizedStars);
      }

      if (Array.isArray(confidence.reasons)) {
        confidence.reasons.forEach((reason) => {
          if (typeof reason !== 'string') return;
          if (!confidenceReasons.includes(reason)) confidenceReasons.push(reason);
        });
      }
    }

    const maxOptionsSuggested = tier?.maxOptionsSuggested;
    if (maxOptionsSuggested && moduleResult.data && typeof moduleResult.data === 'object') {
      OPTION_ARRAY_KEYS.forEach((key) => {
        if (Array.isArray(moduleResult.data[key])) {
          moduleResult.data[key] = moduleResult.data[key].slice(0, maxOptionsSuggested);
        }
      });
    }
  }

  const confidenceSummaryStars = confidenceStars.length
    ? normalizeConfidenceStars(confidenceStars.reduce((sum, v) => sum + v, 0) / confidenceStars.length)
    : null;
  const verificationSummary = summarizeVerification(results);

  return {
    success: true,
    caseId: plan.caseId,
    activePatterns: plan.activePatterns,
    executeModules: plan.executeModules,
    plan,
    results,
    evidence: {},
    confidence: {},
    verification: {},
    evidenceSummary: {
      count: evidenceCount,
      asOf: asOfDate,
    },
    confidenceSummary: {
      stars: confidenceSummaryStars,
      reasons: confidenceReasons.slice(0, 5),
    },
    verificationSummary,

    messageKey: 'AMP_INTAKE_SUCCESS',
    message: renderMessage('AMP_INTAKE_SUCCESS', {}, l),

    meta: {
      tierId: tier ? tier.id : null,
      tier,
      asOf: asOfDate,
      generatedAt: asOfISO,
      lang: l,
      confidenceModel: 'stars-5',
      evidencePolicy: 'public_sources_with_verification',

      disclaimer:
        l === 'ko'
          ? `본 리포트는 ${asOfDate} 기준 공개 정보 및 검증 가능한 출처를 기반으로 작성되었습니다. 정책은 예고 없이 변경될 수 있으며 최종 결정은 고객에게 있습니다.`
          : `This report is based on publicly available and verifiable sources as of ${asOfDate}. Policies may change without notice, and final decisions remain with the client.`,
    },
  };
}

module.exports = { assembleReport };
