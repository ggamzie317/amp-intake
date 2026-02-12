// tests/ampIntake.full-matrix.test.js
const { ampIntake, PATTERNS } = require('../index'); // PATTERNS 직접 가져오기
const { makeIntake } = require('./intakeFactory');

/**
 * Req/Res Mock Helper
 */
function createMockReqRes(body) {
  const req = { method: 'POST', body };
  let statusCode = 200;
  let sentBody = null;
  const res = {
    status(code) { statusCode = code; return this; },
    send(payload) { sentBody = payload; return this; }
  };
  return { req, res, getResult: () => ({ statusCode, body: sentBody }) };
}

describe('AMP Routing Full Matrix Analysis (Data-Driven)', () => {
  
  // PATTERNS 배열을 순회하며 각 패턴별로 테스트 케이스를 동적 생성
  PATTERNS.forEach((p) => {
    const { id, when, modules } = p;
    
    // 테스트 이름 가독성을 위해 라벨 생성
    const testLabel = `${id}: [${when.primaryGoal}] ${when.scenario || '(no-scenario)'} (urgency: ${when.urgency || 'any'})`;

    test(testLabel, async () => {
      // 1. Intake 데이터 생성
      // when 객체에 있는 조건을 그대로 주입 (makeIntake가 나머지 필수 필드 보완)
      const intake = makeIntake({
        routing: {
          primaryGoal: when.primaryGoal,
          scenario: when.scenario,
          urgency: when.urgency || 'normal' // 스키마 필수값 대응
        },
        meta: { caseId: `MATRIX-TEST-${id}` }
      });

      // 2. 실행
      const { req, res, getResult } = createMockReqRes(intake);
      await ampIntake(req, res);
      const { statusCode, body } = getResult();

// [여기에 추가하세요]
      if (statusCode === 400) {
        console.log('--- ❌ P22 스키마 에러 상세 원인 ---');
        console.log(JSON.stringify(body.errors, null, 2));
        console.log('-----------------------------------');
      }
      // 3. 검증
      // 모든 패턴은 스키마를 통과해야 하므로 200 OK여야 함
      expect(statusCode).toBe(200);
      expect(body.success).toBe(true);

      // 해당 패턴 ID가 결과에 포함되어 있는지 확인
      expect(body.activePatterns).toContain(id);

      // 해당 패턴에 정의된 모듈들이 결과에 모두 포함되어 있는지 확인
      if (modules && modules.length > 0) {
        modules.forEach(expectedModule => {
          expect(body.executeModules).toContain(expectedModule);
        });
      }
    });
  });
});
