/**
 * 여행/항공 관련 비즈니스 로직 핸들러
 */
const { renderMessage, resolveLang } = require('../config/sot');
const { getAsOfDate } = require('../utils/time');

const travelHandlers = {
  'P06_TRAVEL_AIR_BASIC': async (data, lang) => {
    const resolvedLang = resolveLang(lang);
    const asOf = getAsOfDate() || new Date().toISOString().slice(0, 10);
    const sourceProgram = data.domain?.programs?.sourceProgram || 'unknown';
    const pointBalance = data.domain?.balances?.pointBalance ?? 0;
    const transferRatio = data.domain?.pricing?.transferRatio ?? null;

    const messageKey = 'P06_TRAVEL_AIR_BASIC_COMPLETED';
    return {
      status: 'completed',
      messageKey,
      message: renderMessage(messageKey, {}, resolvedLang),
      data: {
        summary: 'One-way travel baseline was prepared with deterministic placeholder assumptions.',
        nextSteps: [
          'Validate preferred route and dates against official partner award pages.',
          'Compare transfer timing and taxes before moving points.',
        ],
        inputsUsed: {
          sourceProgram,
          pointBalance,
          transferRatio,
          urgency: data.routing?.urgency || 'normal',
        },
      },
      evidence: [
        {
          kind: 'public',
          title: 'Program transfer partner guide',
          sourceType: 'official',
          url: 'https://example.com/official-transfer-guide',
          placeholder: true,
          asOf,
          notes: 'Placeholder official source for transfer constraints and timing.',
        },
        {
          kind: 'public',
          title: 'Award booking walkthrough',
          sourceType: 'blog',
          url: 'https://example.com/blog-award-booking',
          placeholder: true,
          asOf,
          notes: 'Placeholder tactical checklist for one-way award booking flow.',
        },
      ],
      confidence: {
        stars: 4,
        reasons: [
          'Inputs are complete for a baseline one-way routing analysis.',
          'Evidence links are placeholders pending production verification.',
        ],
      },
      verification: {
        perplexity: 'todo',
        chatgpt: 'drafted',
        gemini: 'todo',
      },
    };
  },

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
