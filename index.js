// index.js

// --- 0. 모듈 핸들러 로드 ---
const cashHandlers = require('./handlers/cashHandlers'); // 기존 M01 등 이동 후 호출
const travelHandlers = require('./handlers/travelHandlers'); // 새로 만든 P06용
const { makeUnimplementedResult } = require('./utils/message');
const { renderMessage, resolveLang } = require('./config/sot');

// 1. 중복된 선언을 하나로 합칩니다.
const MODULE_HANDLERS = {
  ...cashHandlers,
  ...travelHandlers,
  // 앞으로 M02, M03 등을 여기에 추가
};

const Ajv = (require('ajv').default || require('ajv'));
const addFormats = require('ajv-formats');
const intakeSchema = require('./amp-intake-v1.schema.json');

// --- 1. 스키마 검증기 설정 ---
const ajv = new Ajv({ allErrors: true, strictSchema: false, strictTypes: false });
addFormats(ajv);
const validateIntake = ajv.compile(intakeSchema);

// --- 3. 기본 핸들러 (미구현 모듈용 안전망) ---
// 이 녀석 덕분에 51개 모듈을 한 번에 다 안 짜도 시스템이 터지지 않습니다.
async function defaultHandler(moduleId, data, lang) {
  const l = resolveLang(lang);
  const r = makeUnimplementedResult(moduleId, l, 'simulation');
  return {
    status: r.status,
    message: r.message,
    timestamp: new Date().toISOString(),
  };
}

// --- 4. 핵심 실행 로직 (Executor) ---
async function executeModules(moduleIds, inputData, lang) {
  const results = {};

  for (const mid of moduleIds) {
    // 모든 핸들러 시그니처를 (data, lang)으로 통일
    const handler = MODULE_HANDLERS[mid] || ((data, l) => defaultHandler(mid, data, l));

    try {
      // lang 전달 (핸들러가 안 받으면 무시됨)
      results[mid] = await handler(inputData, lang);
    } catch (err) {
      results[mid] = { status: 'error', message: err.message };
    }
  }

  return results;
}

// --- 5. 라우팅 로직 (PATTERNS 기반) ---
const { PATTERNS } = require('./patterns'); // 별도 파일이면 require, 아니면 하단 정의

function resolveAMPPlan(input, caseId) {
  const activePatterns = [];
  const modulesToExecute = [];
  const patternDetails = [];

  for (const p of PATTERNS) {
    if (matchesWhen(input, p.when)) {
      activePatterns.push(p.id);
      patternDetails.push({ id: p.id, message: p.message || `Pattern ${p.id} active` });
      if (p.modules) modulesToExecute.push(...p.modules);
    }
  }

  return {
    caseId,
    activePatterns: [...new Set(activePatterns)],
    executeModules: [...new Set(modulesToExecute)],
    patternDetails,
  };
}

function matchesWhen(input, condition) {
  return Object.entries(condition).every(([key, val]) => input[key] === val);
}

// --- 6. 메인 엔트리포인트 (ampIntake) ---
async function ampIntake(req, res) {
  try {
    // 405도 SOT 통일
    if (req.method !== 'POST') {
      const lang405 = resolveLang(req.body?.meta?.lang);
      return res.status(405).send({
        success: false,
        messageKey: 'AMP_INTAKE_METHOD_NOT_ALLOWED',
        message: renderMessage('AMP_INTAKE_METHOD_NOT_ALLOWED', {}, lang405),
      });
    }

    const intake = req.body;
    const lang = resolveLang(intake?.meta?.lang);

    // 400도 SOT 통일
    if (!validateIntake(intake)) {
      return res.status(400).send({
        success: false,
        messageKey: 'AMP_INTAKE_VALIDATION_FAILED',
        message: renderMessage('AMP_INTAKE_VALIDATION_FAILED', {}, lang),
        errors: validateIntake.errors,
      });
    }

    const caseId = intake.meta?.caseId || `AMP-${Date.now()}`;
    const plan = resolveAMPPlan(intake.routing, caseId);

    // 라우팅이 결정되면 즉시 해당 모듈들을 실행
    const results = await executeModules(plan.executeModules, intake, lang);

    // 200도 SOT 통일
    return res.status(200).send({
      success: true,
      caseId: plan.caseId,
      activePatterns: plan.activePatterns,
      executeModules: plan.executeModules,
      results,
      messageKey: 'AMP_INTAKE_SUCCESS',
      message: renderMessage('AMP_INTAKE_SUCCESS', {}, lang),
    });
  } catch (err) {
    // 500도 SOT 통일 (try 내 lang이 없을 수도 있으니 안전하게)
    return res.status(500).send({
      success: false,
      messageKey: 'AMP_INTAKE_INTERNAL_ERROR',
      message: renderMessage('AMP_INTAKE_INTERNAL_ERROR', {}, resolveLang(req.body?.meta?.lang)),
      error: err.message,
    });
  }
}

module.exports = { ampIntake, PATTERNS };
