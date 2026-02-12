// tests/ampIntake.error.test.js
const { ampIntake } = require('../index');
const { makeIntake } = require('./intakeFactory');

// Req/Res Mock Helper (기존과 동일)
function createMockReqRes(body, method = 'POST') {
  const req = { method, body };
  let statusCode = 200;
  let sentBody = null;
  const res = {
    status(code) { statusCode = code; return this; },
    send(payload) { sentBody = payload; return this; }
  };
  return { req, res, getResult: () => ({ statusCode, body: sentBody }) };
}

describe('AMP Intake Negative & Error Tests', () => {

  test('실패: routing.primaryGoal이 허용되지 않은 값일 때 (400 Bad Request)', async () => {
    const intake = makeIntake({
      routing: {
        primaryGoal: 'INVALID_GOAL', // 스키마에 없는 값
        scenario: 'cashout_vs_transfer'
      }
    });

    const { req, res, getResult } = createMockReqRes(intake);
    await ampIntake(req, res);
    const { statusCode, body } = getResult();

    expect(statusCode).toBe(400);
    expect(body.success).toBe(false);
    // 에러 메시지에 해당 필드가 언급되는지 확인
    const errorDetails = JSON.stringify(body.errors);
    expect(errorDetails).toContain('primaryGoal');
  });

  test('실패: 필수 필드(meta.caseId)가 누락되었을 때 (400 Bad Request)', async () => {
    const intake = makeIntake();
    delete intake.meta.caseId; // 필수 필드 삭제

    const { req, res, getResult } = createMockReqRes(intake);
    await ampIntake(req, res);
    const { statusCode, body } = getResult();

    expect(statusCode).toBe(400);
    expect(body.success).toBe(false);
    expect(JSON.stringify(body.errors)).toContain('caseId');
  });

  test('실패: 숫자 필드에 문자열이 들어갔을 때 (domain.pricing.transferRatio)', async () => {
    const intake = makeIntake({
      domain: {
        pricing: {
          transferRatio: "not-a-number" // 숫자가 와야 함
        }
      }
    });

    const { req, res, getResult } = createMockReqRes(intake);
    await ampIntake(req, res);
    const { statusCode, body } = getResult();

    expect(statusCode).toBe(400);
    expect(body.success).toBe(false);
    expect(JSON.stringify(body.errors)).toContain('transferRatio');
  });

  test('실패: 날짜 포맷(meta.createdAt)이 ISO 8601이 아닐 때', async () => {
    const intake = makeIntake({
      meta: {
        createdAt: '2025/02/12' // 잘못된 포맷
      }
    });

    const { req, res, getResult } = createMockReqRes(intake);
    await ampIntake(req, res);
    const { statusCode, body } = getResult();

    expect(statusCode).toBe(400);
    expect(body.success).toBe(false);
    expect(JSON.stringify(body.errors)).toContain('createdAt');
  });

});
// ... 기존 코드 아래에 추가 ...

test('P02 실행 시: 핸들러가 없어도 시뮬레이션 결과(Simulated)가 반환되어야 한다', async () => {
  const intake = makeIntake({
    routing: {
      primaryGoal: 'cash_finance',
      scenario: 'points_expiring_soon' // P02 조건
    },
    meta: { caseId: 'TEST-P02-SIMULATION' }
  });

  const { req, res, getResult } = createMockReqRes(intake);
  await ampIntake(req, res);
  const { statusCode, body } = getResult();

  expect(statusCode).toBe(200);
  expect(body.activePatterns).toContain('P02_POINTS_EXPIRING_SOON');
  
  // 핵심 검증: M02 결과가 'simulated' 상태로 들어있는지 확인
  const m02Result = body.results['M02_POINTS_EXPIRY_ALERT'];
  expect(m02Result).toBeDefined();
  expect(m02Result.status).toBe('simulated'); // 우리가 만든 기본 핸들러가 작동함
  expect(m02Result.message).toContain('not implemented yet');
});
