/**
 * 여행/항공 관련 비즈니스 로직 핸들러
 */
const travelHandlers = {
  // [P06] 이코노미 vs 비즈니스 효율 비교
  'M06_ECONOMY_BUSINESS_COMPARISON': async (data) => {
    const { pointBalance } = data.domain?.balances || { pointBalance: 0 };
    
    // 예시 로직: 비즈니스 예약에 필요한 최소 포인트가 60,000이라고 가정
    const canAffordBusiness = pointBalance >= 60000;
    
    return {
      status: 'completed',
      recommendation: canAffordBusiness ? 'BUSINESS_CLASS' : 'ECONOMY_CLASS',
      reason: canAffordBusiness 
        ? '보유 포인트가 충분하여 비즈니스 승급 효율이 좋습니다.' 
        : '포인트가 부족하여 이코노미 예약 후 추후 승급을 노리세요.',
      requiredPoints: 60000
    };
  }
};

module.exports = travelHandlers;
