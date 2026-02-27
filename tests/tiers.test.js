const { TIERS } = require('../config/tiers');

describe('Tier config', () => {
  test('all 3 tiers exist', () => {
    expect(TIERS).toHaveProperty('ESSENTIAL');
    expect(TIERS).toHaveProperty('STRATEGIC');
    expect(TIERS).toHaveProperty('EXECUTIVE');
  });

  test('EXECUTIVE has 7 chatbot days', () => {
    expect(TIERS.EXECUTIVE.includesChatbotDays).toBe(7);
  });
});
