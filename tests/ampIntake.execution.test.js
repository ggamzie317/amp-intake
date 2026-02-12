const { ampIntake } = require('../index');
const { makeIntake, makeIntakeForPattern } = require('./intakeFactory'); // 함수 추가

describe('AMP Execution Tests', () => {
  test('P01 실행 시 실제 계산 결과가 포함되어야 한다', async () => {
    const intake = makeIntake({
      routing: { primaryGoal: 'cash_finance', scenario: 'cashout_vs_transfer' }
    });

    const res = await simulateIntake(intake);
    
    expect(res.body.success).toBe(true);
    // M01 핸들러가 반환한 실제 데이터 확인
    expect(res.body.results['M01_CASH_OUT_VS_TRANSFER_ANALYSIS'].status).toBe('completed');
  });

  test('미구현 패턴(P02) 요청 시 에러 대신 pending 결과가 와야 한다', async () => {
    const intake = makeIntake({
      routing: { primaryGoal: 'cash_finance', scenario: 'points_expiring_soon' }
    });

    const res = await simulateIntake(intake);
    
    expect(res.body.success).toBe(true);
    // 구현 안 된 모듈도 defaultHandler 덕분에 200 OK와 함께 pending 메시지를 줌
    expect(res.body.results['M02_POINTS_EXPIRY_ALERT'].status).toBe('pending');
  });
});

// ... (기존 P01, P02 테스트 아래에 추가)

  test('P06 실행 시 travelHandlers의 로직이 정확히 수행되어야 한다', async () => {
    // intakeFactory의 신규 기능을 사용하여 P06 데이터 생성
    const intake = makeIntakeForPattern('P06', {
      domain: { balances: { pointBalance: 70000 } } // 6만 포인트 이상 설정
    });

    const res = await simulateIntake(intake);
    
    expect(res.body.success).toBe(true);
    const result = res.body.results['M06_ECONOMY_BUSINESS_COMPARISON'];
    expect(result.status).toBe('completed');
    expect(result.recommendation).toBe('BUSINESS_CLASS'); // 7만 포인트이므로 비즈니스 추천
  });

async function simulateIntake(body) {
  const req = { method: 'POST', body };
  let resStatus, resBody;
  const res = {
    status(s) { resStatus = s; return this; },
    send(b) { resBody = b; return this; }
  };
  await ampIntake(req, res);
  return { status: resStatus, body: resBody };
}

