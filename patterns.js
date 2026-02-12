/**
 * AMP Intake Routing Patterns Table (Full Version: P01-P51)
 * 모든 테스트 케이스와 비즈니스 로직을 위한 전체 라우팅 설정입니다.
 */

const PATTERNS = [
  // --- CASH & FINANCE (P01-P05, P14, P30-P33, P43) ---
  { id: 'P01_CASH_OUT_VS_TRANSFER', when: { primaryGoal: 'cash_finance', scenario: 'cashout_vs_transfer' }, modules: ['M01_CASH_OUT_VS_TRANSFER_ANALYSIS'] },
  { id: 'P02_POINTS_EXPIRING_SOON', when: { primaryGoal: 'cash_finance', scenario: 'points_expiring_soon' }, modules: ['M02_POINTS_EXPIRY_ALERT'] },
  { id: 'P03_BEFORE_CARD_CANCELLATION', when: { primaryGoal: 'cash_finance', scenario: 'before_card_cancellation' }, modules: ['M03_CARD_CANCELLATION_CHECKLIST'] },
  { id: 'P04_POINTS_CASH_MIX', when: { primaryGoal: 'cash_finance', scenario: 'points_cash_mix' }, modules: ['M04_POINTS_CASH_MIX_OPTIMIZER'] },
  { id: 'P05_ANNUAL_FEE_VALUE_CHECK', when: { primaryGoal: 'cash_finance', scenario: 'annual_fee_value_check' }, modules: ['M05_ANNUAL_FEE_VALUE_REPORT'] },
  { id: 'P14_POINTS_CASH_VS_FULL_POINTS', when: { primaryGoal: 'cash_finance', scenario: 'points_cash_vs_full_points' }, modules: ['M14_POINTS_CASH_FULL_COMPARISON'] },
  { id: 'P30_BUY_POINTS_VS_PAY_CASH', when: { primaryGoal: 'cash_finance', scenario: 'buy_points_vs_pay_cash' }, modules: ['M30_BUY_POINTS_VS_PAY_CASH_ANALYZER'] },
  { id: 'P31_MILEAGE_PURCHASE_THRESHOLD', when: { primaryGoal: 'cash_finance', scenario: 'mileage_purchase_threshold' }, modules: ['M31_MILEAGE_PURCHASE_THRESHOLD_CHECK'] },
  { id: 'P32_CASH_TOPUP_STRATEGY', when: { primaryGoal: 'cash_finance', scenario: 'cash_topup_strategy' }, modules: ['M32_CASH_TOPUP_STRATEGY_PLANNER'] },
  { id: 'P33_PROMO_TIMING_PURCHASE', when: { primaryGoal: 'cash_finance', scenario: 'promo_timing_purchase' }, modules: ['M33_PROMO_TIMING_PURCHASE_ANALYZER'] },
  { id: 'P43_TRANSFER_FEE_VALUE', when: { primaryGoal: 'cash_finance', scenario: 'transfer_fee_value' }, modules: ['M43_TRANSFER_FEE_VALUE_ANALYZER'] },

  // --- TRAVEL AIR (P06-P10, P22, P34-P35) ---
  { id: 'P06_ECONOMY_VS_BUSINESS', when: { primaryGoal: 'travel_air', scenario: 'economy_vs_business' }, modules: ['M06_ECONOMY_BUSINESS_COMPARISON'] },
  { id: 'P07_UPGRADE_VS_FULL_REDEMPTION', when: { primaryGoal: 'travel_air', scenario: 'upgrade_vs_full_redemption' }, modules: ['M07_UPGRADE_VS_FULL_REDEEM_ANALYZER'] },
  { id: 'P08_PEAK_VS_OFFPEAK', when: { primaryGoal: 'travel_air', scenario: 'peak_vs_offpeak' }, modules: ['M08_PEAK_OFFPEAK_TIMING_ANALYZER'] },
  { id: 'P09_DIRECT_VS_CONNECTING', when: { primaryGoal: 'travel_air', scenario: 'direct_vs_connecting' }, modules: ['M09_DIRECT_CONNECTING_ROUTE_ANALYZER'] },
  { id: 'P10_PARTNER_AIRLINE_USE', when: { primaryGoal: 'travel_air', scenario: 'partner_airline_use' }, modules: ['M10_PARTNER_AIRLINE_OPTIMIZER'] },
  { id: 'P22_URGENT_BOOKING', when: { primaryGoal: 'travel_air', scenario: 'urgent_booking', urgency: 'urgent' }, modules: ['M22_URGENT_BOOKING_PLANNER'] },
  { id: 'P34_MULTI_CITY_ROUTE', when: { primaryGoal: 'travel_air', scenario: 'multi_city_route' }, modules: ['M34_MULTI_CITY_ROUTE_OPTIMIZER'] },
  { id: 'P35_STOPOVER_STRATEGY', when: { primaryGoal: 'travel_air', scenario: 'stopover_strategy' }, modules: ['M35_STOPOVER_STRATEGY_PLANNER'] },

  // --- TRAVEL HOTEL (P11-P13, P15, P36-P37) ---
  { id: 'P11_FREE_NIGHT_VS_UPGRADE', when: { primaryGoal: 'travel_hotel', scenario: 'free_night_vs_upgrade' }, modules: ['M11_FREE_NIGHT_UPGRADE_ANALYZER'] },
  { id: 'P12_BREAKFAST_LOUNGE_VALUE', when: { primaryGoal: 'travel_hotel', scenario: 'breakfast_lounge_value' }, modules: ['M12_BREAKFAST_LOUNGE_VALUE_ANALYZER'] },
  { id: 'P13_PEAK_SEASON_FREE_STAY', when: { primaryGoal: 'travel_hotel', scenario: 'peak_season_free_stay' }, modules: ['M13_PEAK_SEASON_FREE_STAY_ANALYZER'] },
  { id: 'P15_ELITE_STATUS_USE', when: { primaryGoal: 'travel_hotel', scenario: 'elite_status_use' }, modules: ['M15_ELITE_STATUS_OPTIMIZER'] },
  { id: 'P36_HOTEL_REWARD_RESERVATION', when: { primaryGoal: 'travel_hotel', scenario: 'reward_reservation' }, modules: ['M36_HOTEL_REWARD_RESERVATION_ANALYZER'] },
  { id: 'P37_POINT_PLUS_CASH_STAY', when: { primaryGoal: 'travel_hotel', scenario: 'point_plus_cash_stay' }, modules: ['M37_POINT_PLUS_CASH_STAY_ANALYZER'] },

  // --- PORTFOLIO (P16-P21, P23-P29, P38-P41, P45, P50-P51) ---
  { id: 'P16_CARD_TO_AIRLINE_TRANSFER', when: { primaryGoal: 'portfolio', scenario: 'card_to_airline_transfer' }, modules: ['M16_CARD_AIRLINE_TRANSFER_PLANNER'] },
  { id: 'P17_FLIGHT_HOTEL_COMBO', when: { primaryGoal: 'portfolio', scenario: 'flight_hotel_combo' }, modules: ['M17_FLIGHT_HOTEL_COMBO_PLANNER'] },
  { id: 'P18_FAMILY_POOLING', when: { primaryGoal: 'portfolio', scenario: 'family_pooling' }, modules: ['M18_FAMILY_POOLING_RULE_CHECK'] },
  { id: 'P21_MILEAGE_PORTFOLIO', when: { primaryGoal: 'portfolio', scenario: 'mileage_portfolio' }, modules: ['M21_MILEAGE_PORTFOLIO_PLANNER'] },
  { id: 'P23_SHORT_LONG_HAUL_MIX', when: { primaryGoal: 'portfolio', scenario: 'short_long_haul_mix' }, modules: ['M23_SHORT_LONG_HAUL_MIX_PLANNER'] },
  { id: 'P24_HOTEL_CHAIN_MIX', when: { primaryGoal: 'portfolio', scenario: 'hotel_chain_mix' }, modules: ['M24_HOTEL_CHAIN_MIX_PLANNER'] },
  { id: 'P25_LARGE_BALANCE_CLEANUP', when: { primaryGoal: 'portfolio', scenario: 'large_balance_cleanup' }, modules: ['M25_LARGE_BALANCE_CLEANUP_PLANNER'] },
  { id: 'P27_MULTI_POINTS_PARALLEL', when: { primaryGoal: 'portfolio', scenario: 'multi_points_parallel' }, modules: ['M27_MULTI_POINTS_PARALLEL_PLANNER'] },
  { id: 'P28_AIR_HOTEL_SPLIT', when: { primaryGoal: 'portfolio', scenario: 'air_hotel_split' }, modules: ['M28_AIR_HOTEL_SPLIT_PLANNER'] },
  { id: 'P29_CARD_AB_MIX', when: { primaryGoal: 'portfolio', scenario: 'card_ab_mix' }, modules: ['M29_CARD_AB_MIX_PLANNER'] },
  { id: 'P38_TARGETED_PROMO_URGENT', when: { primaryGoal: 'portfolio', scenario: 'targeted_promo', urgency: 'urgent' }, modules: ['M38_TARGETED_PROMO_ANALYZER'] },
  { id: 'P39_PROMO_STACKING', when: { primaryGoal: 'portfolio', scenario: 'promo_stacking' }, modules: ['M39_PROMO_STACKING_ANALYZER'] },
  { id: 'P40_DOUBLE_DIPPING', when: { primaryGoal: 'portfolio', scenario: 'double_dipping' }, modules: ['M40_DOUBLE_DIPPING_ANALYZER'] },
  { id: 'P41_PROMO_VS_STANDARD', when: { primaryGoal: 'portfolio', scenario: 'promo_vs_standard', urgency: 'urgent' }, modules: ['M41_PROMO_VS_STANDARD_ANALYZER'] },
  { id: 'P45_ACCOUNT_MERGE', when: { primaryGoal: 'portfolio', scenario: 'account_merge' }, modules: ['M45_ACCOUNT_MERGE_PLANNER'] },
  { id: 'P50_MEMBERSHIP_UPGRADE', when: { primaryGoal: 'portfolio', scenario: 'membership_upgrade' }, modules: ['M50_MEMBERSHIP_UPGRADE_PLANNER'] },
  { id: 'P51_LOYALTY_PROGRAM_EXIT', when: { primaryGoal: 'portfolio', scenario: 'loyalty_program_exit' }, modules: ['M51_LOYALTY_PROGRAM_EXIT_PLANNER'] },

  // --- COMPLIANCE (P19, P20, P26, P42, P44, P46-P49) ---
  { id: 'P19_BUSINESS_PERSONAL_TRIP', when: { primaryGoal: 'compliance', scenario: 'business_personal_trip' }, modules: ['M19_BUSINESS_PERSONAL_TRIP_CHECK'] },
  { id: 'P20_BUSINESS_CONF_SUMMARY', when: { primaryGoal: 'compliance', scenario: 'business_conf_summary' }, modules: ['M20_BUSINESS_CONF_SUMMARY_CHECK'] },
  { id: 'P26_RULE_CHANGE', when: { primaryGoal: 'compliance', scenario: 'rule_change' }, modules: ['M26_RULE_CHANGE_CHECK'] },
  { id: 'P42_FAMILY_TRANSFER', when: { primaryGoal: 'compliance', scenario: 'family_transfer' }, modules: ['M42_FAMILY_TRANSFER_CHECK'] },
  { id: 'P44_GIFT_INHERITANCE', when: { primaryGoal: 'compliance', scenario: 'gift_inheritance' }, modules: ['M44_GIFT_INHERITANCE_CHECK'] },
  { id: 'P46_CORP_CODE_VS_PROMO', when: { primaryGoal: 'compliance', scenario: 'corp_code_vs_promo' }, modules: ['M46_CORP_CODE_VS_PROMO_CHECK'] },
  { id: 'P47_CORP_CODE_EARN', when: { primaryGoal: 'compliance', scenario: 'corp_code_earn' }, modules: ['M47_CORP_CODE_EARN_CHECK'] },
  { id: 'P48_CORP_CODE_REDEEM', when: { primaryGoal: 'compliance', scenario: 'corp_code_redeem' }, modules: ['M48_CORP_CODE_REDEEM_CHECK'] },
  { id: 'P49_GOV_TRAVEL_RESTRICTION', when: { primaryGoal: 'compliance', scenario: 'gov_travel_restriction' }, modules: ['M49_GOV_TRAVEL_RESTRICTION_CHECK'] }
];

module.exports = { PATTERNS };
