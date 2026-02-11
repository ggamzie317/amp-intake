const { ampIntake } = require('../index');

function createMockReqRes(body, method = 'POST') {
  const req = {
    method,
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

test('ampIntake contract - success response has required fields', async () => {
  const intake = {
    routing: {
      primaryGoal: 'cash_finance',
      scenario: 'cashout_vs_transfer',
      urgency: 'normal'
    },
    meta: {
      caseId: 'CONTRACT-TEST-001'
    }
  };

  const { req, res, getResult } = createMockReqRes(intake);

  await ampIntake(req, res);

  const { statusCode, body } = getResult();

  expect(statusCode).toBe(200);
  expect(body).toHaveProperty('success', true);
  expect(typeof body.caseId).toBe('string');
  expect(Array.isArray(body.activePatterns)).toBe(true);
  expect(Array.isArray(body.executeModules)).toBe(true);
});

test('ampIntake contract - method not allowed returns 405', async () => {
  const { req, res, getResult } = createMockReqRes({}, 'GET');

  await ampIntake(req, res);

  const { statusCode, body } = getResult();

  expect(statusCode).toBe(405);
  expect(body).toHaveProperty('success', false);
  expect(typeof body.error).toBe('string');
});
