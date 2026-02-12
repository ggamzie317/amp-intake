/**
 * amp-intake-v1.schema.json의 필수 필드들을 만족하는 기본 객체를 생성합니다.
 */
function makeBaseIntake() {
  return {
    meta: {
      caseId: 'BASE-CASE-' + Date.now(),
      createdAt: new Date().toISOString(),
      locale: 'en-US',
      currency: 'USD',
      source: 'web',
    },
    routing: {
      primaryGoal: 'cash_finance',
      scenario: 'cashout_vs_transfer',
      urgency: 'normal',
    },
    domain: {
      programs: { sourceProgram: 'DEFAULT-CARD' },
      balances: { pointBalance: 0, mileBalance: 0 },
      pricing: { transferRatio: 1.0 },
    },
    policy: {
      complianceFlags: {
        isPublicOfficial: false,
        isMilitary: false,
        isCorporateTrip: false,
        usesCorporateCard: false,
      },
    },
  };
}

/**
 * 기본 객체 위에 테스트하고 싶은 필드만 덮어씁니다.
 */
function makeIntake(overrides = {}) {
  const base = makeBaseIntake();
  return {
    ...base,
    ...overrides,
    meta: { ...base.meta, ...(overrides.meta || {}) },
    routing: { ...base.routing, ...(overrides.routing || {}) },
    domain: { ...base.domain, ...(overrides.domain || {}) },
    policy: { ...base.policy, ...(overrides.policy || {}) },
  };
}

/**
 * [추가된 부분] 특정 패턴 ID(P01, P06 등)만 입력하면 
 * 라우팅 테이블에 맞는 최적화된 데이터를 즉시 생성합니다.
 */
function makeIntakeForPattern(patternId, overrides = {}) {
  const presets = {
    'P01': { routing: { primaryGoal: 'cash_finance', scenario: 'cashout_vs_transfer' } },
    'P02': { routing: { primaryGoal: 'cash_finance', scenario: 'points_expiring_soon' } },
    'P03': { routing: { primaryGoal: 'cash_finance', scenario: 'before_card_cancellation' } },
    'P06': { routing: { primaryGoal: 'travel_air', scenario: 'economy_vs_business' } },
    // 필요할 때마다 여기에 P07, P08... 등을 추가해나가면 됩니다. [cite: 1]
  };

  const selectedPreset = presets[patternId] || {};
  
  // 프리셋 데이터와 사용자가 직접 전달한 overrides를 합쳐서 makeIntake 호출
  return makeIntake({
    ...selectedPreset,
    ...overrides,
    routing: { ...(selectedPreset.routing || {}), ...(overrides.routing || {}) }
  });
}

module.exports = { 
  makeIntake, 
  makeIntakeForPattern // 새로 만든 함수도 export 해야 테스트 파일에서 쓸 수 있습니다.
};
