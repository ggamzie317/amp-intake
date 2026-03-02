const { ampIntake } = require('../index');
const { assembleReport } = require('../report/assembler');
const travelHandlers = require('../handlers/travelHandlers');
const { makeIntake, makeIntakeForPattern } = require('./intakeFactory');

describe('AMP Execution Tests', () => {
  test('P01 실행 시 실제 계산 결과가 포함되어야 한다', async () => {
    const intake = makeIntake({
      routing: { primaryGoal: 'cash_finance', scenario: 'cashout_vs_transfer' },
    });

    const res = await simulateIntake(intake);

    expect(res.body.success).toBe(true);
    expect(res.body.results.M01_CASH_OUT_VS_TRANSFER_ANALYSIS.status).toBe('completed');
  });

  test('미구현 패턴(P02) 요청 시 에러 대신 pending 결과가 와야 한다', async () => {
    const intake = makeIntake({
      routing: { primaryGoal: 'cash_finance', scenario: 'points_expiring_soon' },
    });

    const res = await simulateIntake(intake);

    expect(res.body.success).toBe(true);
    expect(res.body.results.M02_POINTS_EXPIRY_ALERT.status).toBe('pending');
  });

  test('P06 실행 시 travelHandlers의 로직이 정확히 수행되어야 한다', async () => {
    const intake = makeIntakeForPattern('P06', {
      domain: { balances: { pointBalance: 70000 } },
    });

    const res = await simulateIntake(intake);

    expect(res.body.success).toBe(true);
    const result = res.body.results.M06_ECONOMY_BUSINESS_COMPARISON;
    expect(result.status).toBe('completed');
    expect(result.recommendation).toBe('BUSINESS_CLASS');
  });

  test('meta.tier=executive면 tier 메타가 포함되어야 한다', async () => {
    const intake = makeIntake({
      meta: { tier: 'executive' },
    });

    const res = await simulateIntake(intake);
    expect(res.status).toBe(200);
    expect(res.body.meta.tierId).toBe('executive');
    expect(res.body.meta.tier).toMatchObject({
      id: 'executive',
      priceUsd: 50,
      includesChatbotDays: 7,
    });
  });

  test('유효하지 않은 tier는 assembler에서 null로 정규화된다', () => {
    const intake = makeIntake({ meta: { tier: 'weird' } });
    const plan = {
      caseId: 'ASSEMBLER-TIER-NULL-001',
      activePatterns: ['P06_TRAVEL_AIR_BASIC'],
      executeModules: ['P06_TRAVEL_AIR_BASIC'],
      patternDetails: [],
    };
    const results = {
      P06_TRAVEL_AIR_BASIC: {
        status: 'completed',
      },
    };

    const report = assembleReport({ intake, plan, results, lang: 'en' });
    expect(report.success).toBe(true);
    expect(report.meta.tierId).toBeNull();
    expect(report.meta.tier).toBeNull();
  });

  test('evidenceSummary.count는 P06 모듈 evidence 개수와 같아야 한다', async () => {
    const intake = makeIntake({
      routing: { primaryGoal: 'travel_air', scenario: 'one_way', urgency: 'normal' },
      meta: { tier: 'executive' },
    });
    const moduleResult = await travelHandlers.P06_TRAVEL_AIR_BASIC(intake, 'en');
    const plan = {
      caseId: 'ASSEMBLER-EVIDENCE-001',
      activePatterns: ['P06_TRAVEL_AIR_BASIC'],
      executeModules: ['P06_TRAVEL_AIR_BASIC'],
      patternDetails: [],
    };
    const report = assembleReport({
      intake,
      plan,
      results: { P06_TRAVEL_AIR_BASIC: moduleResult },
      lang: 'en',
    });

    expect(Array.isArray(moduleResult.evidence)).toBe(true);
    expect(moduleResult.evidence.length).toBe(2);
    expect(report.evidenceSummary.count).toBe(moduleResult.evidence.length);
  });
});

async function simulateIntake(body) {
  const req = { method: 'POST', body };
  let resStatus;
  let resBody;
  const res = {
    status(s) {
      resStatus = s;
      return this;
    },
    send(b) {
      resBody = b;
      return this;
    },
  };
  await ampIntake(req, res);
  return { status: resStatus, body: resBody };
}
