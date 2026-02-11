const { ampIntake } = require('../index');

// 아주 간단한 req/res mock
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

test('ampIntake - cash_finance / cashout_vs_transfer 라우팅이 동작한다', async () => {
  const intake = {
    routing: {
      primaryGoal: 'cash_finance',
      scenario: 'cashout_vs_transfer',
      urgency: 'normal'
    },
    meta: {
      caseId: 'TEST-CASE-001'
    }
  };

  const { req, res, getResult } = createMockReqRes(intake);

  await ampIntake(req, res);

  const { statusCode, body } = getResult();

  // 1) HTTP 상태코드가 200인지 확인
  expect(statusCode).toBe(200);

  // 2) success가 true인지 확인
  expect(body).toHaveProperty('success', true);

  // 3) activePatterns에 우리가 기대하는 패턴이 포함됐는지 확인
  expect(Array.isArray(body.activePatterns)).toBe(true);
  expect(body.activePatterns).toContain('P01_CASH_OUT_VS_TRANSFER');

  // 4) executeModules에 기대 모듈이 포함됐는지 확인
  expect(Array.isArray(body.executeModules)).toBe(true);
  expect(body.executeModules).toContain('M01_CASH_OUT_VS_TRANSFER_ANALYSIS');
});
test('ampIntake - cash_finance / points_expiring_soon 라우팅이 동작한다', async () => {
  const intake = {
    routing: {
      primaryGoal: 'cash_finance',
      scenario: 'points_expiring_soon',
      urgency: 'normal'
    },
    meta: {
      caseId: 'TEST-CASE-002'
    }
  };

  const { req, res, getResult } = createMockReqRes(intake);

  await ampIntake(req, res);

  const { statusCode, body } = getResult();

  // 1) HTTP 상태코드가 200인지 확인
  expect(statusCode).toBe(200);

  // 2) success가 true인지 확인
  expect(body).toHaveProperty('success', true);

  // 3) activePatterns에 우리가 기대하는 패턴이 포함됐는지 확인
  expect(Array.isArray(body.activePatterns)).toBe(true);
  expect(body.activePatterns).toContain('P02_POINTS_EXPIRING_SOON');

  // 4) executeModules에 기대 모듈이 포함됐는지 확인
  expect(Array.isArray(body.executeModules)).toBe(true);
  expect(body.executeModules).toContain('M02_POINTS_EXPIRY_ALERT');
});
test('ampIntake - cash_finance / before_card_cancellation 라우팅이 동작한다', async () => {
  const intake = {
    routing: {
      primaryGoal: 'cash_finance',
      scenario: 'before_card_cancellation',
      urgency: 'normal'
    },
    meta: {
      caseId: 'TEST-CASE-003'
    }
  };

  const { req, res, getResult } = createMockReqRes(intake);

  await ampIntake(req, res);

  const { statusCode, body } = getResult();

  // 1) HTTP 상태코드가 200인지 확인
  expect(statusCode).toBe(200);

  // 2) success가 true인지 확인
  expect(body).toHaveProperty('success', true);

  // 3) activePatterns에 우리가 기대하는 패턴이 포함됐는지 확인
  expect(Array.isArray(body.activePatterns)).toBe(true);
  expect(body.activePatterns).toContain('P03_BEFORE_CARD_CANCELLATION');

  // 4) executeModules에 기대 모듈이 포함됐는지 확인
  expect(Array.isArray(body.executeModules)).toBe(true);
  expect(body.executeModules).toContain('M03_CARD_CANCELLATION_CHECKLIST');
});
