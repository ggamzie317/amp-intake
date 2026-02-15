/**
 * 현금/금융 관련 비즈니스 로직 핸들러
 */
const cashHandlers = {
  'M01_CASH_OUT_VS_TRANSFER_ANALYSIS': async (data) => {
    const ratio = data.domain?.pricing?.transferRatio || 1.0;
    const balance = data.domain?.balances?.pointBalance || 0;
    return {
      status: 'completed',
      recommendation: ratio > 1.2 ? 'TRANSFER' : 'KEEP',
      valueEstimate: balance * ratio
    };
  }
};

module.exports = cashHandlers;
