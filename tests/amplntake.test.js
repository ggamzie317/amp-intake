// tests/amplntake.test.js
const { ampIntake } = require('../index');
const { makeIntake } = require('./intakeFactory');

// Req/Res Mock Helper
function createMockReqRes(body) {
  const req = {
    method: 'POST',
    body
  };

  let statusCode = 200;
  let sentBody = null;

  const res = {
    status(code) {
      statusCode = code;
      return this;
    },
    send(payload) {
      sentBody = payload;
      return this;
    }
  };

  return { req, res, getResult: () => ({ statusCode, body: sentBody }) };
}

describe('AMP Intake Functional Tests', () => {

  test('P01: cash_finance / cashout_vs_transfer 라우팅 확인', async () => {
    // Factory를 사용해 필수 필드를 자동 채움 + 테스트 조건만 명시
    const intake = makeIntake({
      routing: {
        primaryGoal: 'cash_finance',
        scenario: 'cashout_vs_transfer',
        urgency: 'normal'
      },
      meta: { caseId: 'TEST-CASE-P01' }
    });

    const { req, res, getResult } = createMockReqRes(intake);
    await ampIntake(req, res);
    const { statusCode, body } = getResult();

    expect(statusCode).toBe(200);
    expect(body.success).toBe(true);
    expect(body.activePatterns).toContain('P01_CASH_OUT_VS_TRANSFER');
    expect(body.executeModules).toContain('M01_CASH_OUT_VS_TRANSFER_ANALYSIS');
  });

  test('P02: cash_finance / points_expiring_soon 라우팅 확인', async () => {
    const intake = makeIntake({
      routing: {
        primaryGoal: 'cash_finance',
        scenario: 'points_expiring_soon'
      },
      meta: { caseId: 'TEST-CASE-P02' }
    });

    const { req, res, getResult } = createMockReqRes(intake);
    await ampIntake(req, res);
    const { statusCode, body } = getResult();

    expect(statusCode).toBe(200);
    expect(body.activePatterns).toContain('P02_POINTS_EXPIRING_SOON');
  });

  test('P03: cash_finance / before_card_cancellation 라우팅 확인', async () => {
    const intake = makeIntake({
      routing: {
        primaryGoal: 'cash_finance',
        scenario: 'before_card_cancellation'
      },
      meta: { caseId: 'TEST-CASE-P03' }
    });

    const { req, res, getResult } = createMockReqRes(intake);
    await ampIntake(req, res);
    const { statusCode, body } = getResult();

    expect(statusCode).toBe(200);
    expect(body.activePatterns).toContain('P03_BEFORE_CARD_CANCELLATION');
  });

});
