// tests/ampIntake.contract.test.js
const { ampIntake } = require('../index');
const { makeIntake } = require('./intakeFactory');

// Req/Res Mock Helper (Method 지원 추가)
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

describe('AMP Intake Contract Tests', () => {

  test('성공 케이스: 필수 필드가 모두 포함된 경우 200 OK 반환', async () => {
    // Factory가 스키마에 맞는 완벽한 데이터를 생성해줌
    const intake = makeIntake({
      meta: { caseId: 'CONTRACT-SUCCESS-001' }
    });

    const { req, res, getResult } = createMockReqRes(intake);
    await ampIntake(req, res);
    const { statusCode, body } = getResult();

    expect(statusCode).toBe(200);
    expect(body).toHaveProperty('success', true);
    expect(body).toHaveProperty('messageKey', 'AMP_INTAKE_SUCCESS');
    expect(typeof body.caseId).toBe('string');
    expect(Array.isArray(body.activePatterns)).toBe(true);
    expect(Array.isArray(body.executeModules)).toBe(true);
  });

  test('실패 케이스: meta.createdAt 포맷이 잘못되면 400 Bad Request 반환', async () => {
    // 다른 필드는 다 정상이지만, createdAt만 스키마(date-time)를 위반하도록 설정
    const intake = makeIntake({
      meta: { createdAt: 'NOT-A-DATE-TIME' }
    });

    const { req, res, getResult } = createMockReqRes(intake);
    await ampIntake(req, res);
    const { statusCode, body } = getResult();

    expect(statusCode).toBe(400);
    expect(body.success).toBe(false);
    // AJV 에러 메시지 확인 (선택 사항)
    // console.log(JSON.stringify(body, null, 2)); 
  });

  test('실패 케이스: HTTP Method가 POST가 아니면 405 Method Not Allowed 반환', async () => {
    // Body 내용은 상관없음
    const { req, res, getResult } = createMockReqRes({}, 'GET');
    
    await ampIntake(req, res);
    const { statusCode, body } = getResult();

    expect(statusCode).toBe(405);
    expect(body.success).toBe(false);
  });

});
