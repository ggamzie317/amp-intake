'use strict';

const TIERS = {
  ESSENTIAL: {
    id: 'essential',
    displayName: 'Essential',
    includesAudio: false,
    includesChatbotDays: 0,
    maxOptionsSuggested: 1,
  },
  STRATEGIC: {
    id: 'strategic',
    displayName: 'Strategic',
    includesAudio: false,
    includesChatbotDays: 0,
    maxOptionsSuggested: 3,
  },
  EXECUTIVE: {
    id: 'executive',
    displayName: 'Executive',
    includesAudio: true,
    includesChatbotDays: 7,
    maxOptionsSuggested: 3,
  },
};

function getTierConfig(tierId) {
  if (!tierId) return null;

  const normalizedId = String(tierId).toLowerCase();
  return Object.values(TIERS).find((tier) => tier.id === normalizedId) || null;
}

module.exports = { TIERS, getTierConfig };
