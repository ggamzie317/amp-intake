/**
 * 현금/금융 관련 비즈니스 로직 핸들러
 */
const cashHandlers = {
  // [P01] 현금화 vs 전환 분석
  'M01_CASH_OUT_VS_TRANSFER_ANALYSIS': async (data) => {
    const ratio = data.domain?.pricing?.transferRatio || 1.0;
    const balance = data.domain?.balances?.pointBalance || 0;
    return {
      status: 'completed',
      recommendation: ratio > 1.2 ? 'TRANSFER' : 'KEEP',
      valueEstimate: balance * ratio
    };
  }
  // 이후 M02, M03, M04, M05 등을 여기에 추가하세요.
};

module.exports = cashHandlers;
