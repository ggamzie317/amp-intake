// 상단에 추가
const cashHandlers = require('./handlers/cashHandlers'); // 기존 M01 등 이동 후 호출
const travelHandlers = require('./handlers/travelHandlers'); // 새로 만든 P06용

// 1. 중복된 선언을 하나로 합칩니다.
const MODULE_HANDLERS = {
  ...cashHandlers,
  ...travelHandlers,
  // 앞으로 M02, M03 등을 여기에 추가
};

// ... (아래 2번 섹션 전체를 삭제하거나 위 핸들러 객체와 통합하세요)
// --- 2. 모듈별 실제 비즈니스 로직 (핸들러) --- 부분을 삭제하세요.

const Ajv = (require('ajv').default || require('ajv'));
const addFormats = require('ajv-formats');
const intakeSchema = require('./amp-intake-v1.schema.json');

// --- 1. 스키마 검증기 설정 ---
const ajv = new Ajv({ allErrors: true, strictSchema: false, strictTypes: false });
addFormats(ajv);
const validateIntake = ajv.compile(intakeSchema);


// --- 3. 기본 핸들러 (미구현 모듈용 안전망) ---
// 이 녀석 덕분에 51개 모듈을 한 번에 다 안 짜도 시스템이 터지지 않습니다.
async function defaultHandler(moduleId, data) {
  return {
    status: 'pending',
    message: `모듈 [${moduleId}]의 로직이 아직 구현되지 않았습니다. (시뮬레이션 모드)`,
    timestamp: new Date().toISOString()
  };
}

// --- 4. 핵심 실행 로직 (Executor) ---
async function executeModules(moduleIds, inputData) {
  const results = {};
  // 51개 모듈 중 무엇이 들어와도 여기서 처리됨
  for (const mid of moduleIds) {
    const handler = MODULE_HANDLERS[mid] || ((data) => defaultHandler(mid, data));
    try {
      results[mid] = await handler(inputData);
    } catch (err) {
      results[mid] = { status: 'error', message: err.message };
    }
  }
  return results;
}

// --- 5. 라우팅 로직 (PATTERNS 기반) ---
// (이전과 동일하게 PATTERNS 배열 유지)
const { PATTERNS } = require('./patterns'); // 만약 별도 파일로 뺐다면 호출, 아니면 하단 정의

function resolveAMPPlan(input, caseId) {
  const activePatterns = [];
  const executeModules = [];
  const patternDetails = [];

  for (const p of PATTERNS) {
    if (matchesWhen(input, p.when)) {
      activePatterns.push(p.id);
      patternDetails.push({ id: p.id, message: p.message || `Pattern ${p.id} active` });
      if (p.modules) executeModules.push(...p.modules);
    }
  }

  return {
    caseId,
    activePatterns: [...new Set(activePatterns)],
    executeModules: [...new Set(executeModules)],
    patternDetails
  };
}

function matchesWhen(input, condition) {
  return Object.entries(condition).every(([key, val]) => input[key] === val);
}

// --- 6. 메인 엔트리포인트 (ampIntake) ---
async function ampIntake(req, res) {
  try {
    if (req.method !== 'POST') return res.status(405).send({ success: false });

    const intake = req.body;
    if (!validateIntake(intake)) {
      return res.status(400).send({ success: false, errors: validateIntake.errors });
    }

    const caseId = intake.meta?.caseId || `AMP-${Date.now()}`;
    const plan = resolveAMPPlan(intake.routing, caseId);

    // [정석적 접근] 라우팅이 결정되면 즉시 해당 모듈들을 실행합니다.
    const results = await executeModules(plan.executeModules, intake);

    return res.status(200).send({
      success: true,
      caseId: plan.caseId,
      activePatterns: plan.activePatterns,
      executeModules: plan.executeModules,
      results, // 실제/가공된 결과 데이터가 나가는 곳
      message: 'AMP 분석이 완료되었습니다.'
    });
  } catch (err) {
    return res.status(500).send({ success: false, error: err.message });
  }
}

module.exports = { ampIntake, PATTERNS };
