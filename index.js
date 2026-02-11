// index.js
// AMP Intake 최소 동작 버전 (Node.js 22, Cloud Functions Framework)
// AMP Intake 최소 동작 버전 (Node.js 22, Cloud Functions Framework)
// index.js
// AMP Intake 최소 동작 버전 (Node.js 22, Cloud Functions Framework)

function logRoutingResult(payload) {
  try {
    console.log(JSON.stringify({ type: 'routing', ...payload }));
  } catch (e) {
    // 로깅 때문에 본 로직이 죽으면 안 됨
  }
}

process.on('uncaughtException', (e) =>
  console.error('[UNCAUGHT]', e && e.message, e && e.stack)
);
process.on('unhandledRejection', (e) =>
  console.error('[REJECTION]', e && e.message, e && e.stack)
);

const Ajv = (require('ajv').default || require('ajv'));


const intakeSchema = require('./amp-intake-v1.schema.json');
console.log('[AJV] intakeSchema.$schema =', intakeSchema && intakeSchema.$schema);
console.log('[AJV] cwd =', process.cwd());

const ajv = new Ajv({
  allErrors: true,
  strictSchema: false,
  strictTypes: false
});

let validateIntake;
try {
  validateIntake = ajv.compile(intakeSchema);
  process.stderr.write('[AJV] compile OK\n');
} catch (e) {

  // Cloud Run에서 console.error가 잘리거나 flush 전에 죽는 경우가 있어서,
  // stderr에 "동기"로 바로 써버립니다.
  const msg = e && e.message ? e.message : String(e);
  const stack = e && e.stack ? e.stack : '(no stack)';
  const props = e ? Object.getOwnPropertyNames(e) : [];

  process.stderr.write('[AJV] compile FAIL message: ' + msg + '\n');
  process.stderr.write('[AJV] compile FAIL props: ' + JSON.stringify(props) + '\n');

  // Ajv 에러 배열이 있으면 그것도 강제로 출력
  try {
    process.stderr.write('[AJV] compile FAIL errors: ' + JSON.stringify(e.errors, null, 2) + '\n');
  } catch (_) {
    process.stderr.write('[AJV] compile FAIL errors: (unserializable)\n');
  }

  process.stderr.write('[AJV] compile FAIL stack:\n' + stack + '\n');

  validateIntake = null;

  // 여기서 종료시키면 로그가 더 확실히 남습니다 (디버깅 끝나면 제거)
}












const functions = require('@google-cloud/functions-framework');

/// 나중에 진짜 패턴 로직을 넣을 자리
// ---- Pattern table (data-driven) ---------------------------------
const PATTERNS = [
  {
    id: 'P01_CASH_OUT_VS_TRANSFER',
    when: { primaryGoal: 'cash_finance', scenario: 'cashout_vs_transfer' },
    modules: ['M01_CASH_OUT_VS_TRANSFER_ANALYSIS']
  },
  {
    id: 'P02_POINTS_EXPIRING_SOON',
    when: { primaryGoal: 'cash_finance', scenario: 'points_expiring_soon' },
    modules: ['M02_POINTS_EXPIRY_ALERT']
  }
];

// criteria 매칭: when에 정의된 필드만 비교 (undefined는 조건에서 제외)
function matchesWhen(input, when) {
  if (!when) return false;

  for (const [k, v] of Object.entries(when)) {
    if (v === undefined) continue; // 조건 미지정이면 스킵
    if (!input || input[k] !== v) return false;
  }
  return true;
}

/// 나중에 진짜 패턴 로직을 넣을 자리
function resolveAMPPlan(input, caseId) {
  const activePatterns = [];
  const executeModules = [];

  for (const p of PATTERNS) {
    if (matchesWhen(input, p.when)) {
      activePatterns.push(p.id);
      for (const m of (p.modules || [])) executeModules.push(m);
    }
  }

  // (선택) 중복 제거: 패턴/모듈이 중복 push될 여지를 원천 차단
  const uniqPatterns = Array.from(new Set(activePatterns));
  const uniqModules = Array.from(new Set(executeModules));

  return {
    caseId,
    activePatterns: uniqPatterns,
    executeModules: uniqModules
  };
}







// HTTP 엔드포인트 이름: ampIntake
async function ampIntake(req, res) {
  try {
    // 1) 메서드 체크
    if (req.method !== 'POST') {
      return res.status(405).send({
        success: false,
        error: 'Method not allowed. Use POST.'
      });
    }

    // 2) 입력 데이터
    const intake = req.body || {};

    // 2-1) JSON Schema 검증 (Intake v1)
    console.log('[AJV] validateIntake typeof:', typeof validateIntake);
    console.log('[AJV] validateIntake isNull:', validateIntake === null);
    console.log('[AJV] validateIntake ctor:', validateIntake?.constructor?.name);
    console.log('[AJV] validateIntake tag:', Object.prototype.toString.call(validateIntake));

    let keys = null, keysErr = null;
    try { keys = Object.keys(validateIntake); }
    catch (e) { keysErr = e?.message || String(e); }

    console.log('[AJV] validateIntake keys:', keys);
    console.log('[AJV] validateIntake keysErr:', keysErr);

    // 1) validator가 함수가 아니면 500으로 막기
// if (typeof validateIntake !== 'function') {
//   console.error('[AJV] Validator is not a function. Validation disabled.', {
//     typeof: typeof validateIntake,
//     value: validateIntake
//   });
//   return res.status(500).send({
//     success: false,
//     message: 'Server misconfiguration: AJV validator is not available'
//   });
// }

// 2) 실제 스키마 검증
// if (!validateIntake(intake)) {
//   const errors = validateIntake.errors || [];
//   return res.status(400).send({
//     success: false,
//     message: 'Invalid AMP intake payload',
//     errors: errors.map(e => ({
//       instancePath: e.instancePath,
//       keyword: e.keyword,
//       message: e.message,
//       params: e.params
//     }))
//   });
// }


    // 3) caseId 생성
    const ts = Date.now();
    const rand = Math.random().toString(36).substring(2, 7);
    const caseId =
      intake.meta && intake.meta.caseId
        ? intake.meta.caseId
        : `AMP-${ts}-${rand}`;

   // 4) plan 계산
const planInput = {
  primaryGoal: intake.routing?.primaryGoal,
  scenario: intake.routing?.scenario,
  urgency: intake.routing?.urgency
};

    const plan = resolveAMPPlan(planInput, caseId);


    // 5) TODO: 저장/이메일

    // 5-1) 라우팅 결과 로그
    logRoutingResult({
      caseId: plan.caseId,
      routing: intake.routing || {},
      activePatterns: plan.activePatterns,
      executeModules: plan.executeModules
    });

    // 6) 성공 응답
    return res.status(200).send({
      success: true,
      caseId: plan.caseId,
      activePatterns: plan.activePatterns,
      executeModules: plan.executeModules,
      message: 'AMP intake received. Analysis will start soon.'
    });
  } catch (err) {
    console.error('AMP Intake Error', err);
    return res.status(500).send({
      success: false,
      error: err.message || 'Unknown error'
    });
  }
}

// Cloud Functions Framework에 등록
functions.http('ampIntake', ampIntake);

// Jest에서 사용할 수 있도록 export
module.exports = { ampIntake };
