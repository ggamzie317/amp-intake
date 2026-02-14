mkdir -p config
cat > config/sot.js <<'EOF'
'use strict';

/**
 * AMP SOT (Single Source of Truth) — Phase 1 (Minimal)
 * - Core policy: lang / unimplemented statusKey / i18n message templates
 * - Keep HTTP status handling separate (API-level).
 */

const SOT = {
  global: {
    defaultLang: 'en',
    unimplementedStatusKey: 'pending',
  },

  // Module-level status keys (NOT HTTP status)
  statusKeys: {
    pending: { behavior: 'warn' },
    success: { behavior: 'normal' },
    error: { behavior: 'fail' },
    simulated: { behavior: 'normal' },
  },

  // Message templates (key -> { en, ko })
  // Template tokens: {moduleId}, {modeLabel}
  messages: {
    MODULE_NOT_IMPLEMENTED: {
      en: 'Module [{moduleId}] logic not implemented yet ({modeLabel})',
      ko: '모듈 [{moduleId}]의 로직이 아직 구현되지 않았습니다. ({modeLabel})',
    },
    MODE_SIMULATION: {
      en: 'simulation mode',
      ko: '시뮬레이션 모드',
    },
    MODE_PRODUCTION: {
      en: 'production mode',
      ko: '프로덕션 모드',
    },
  },
};

function isSupportedLang(lang) {
  return lang === 'en' || lang === 'ko';
}

function resolveLang(lang) {
  return isSupportedLang(lang) ? lang : SOT.global.defaultLang;
}

module.exports = { SOT, resolveLang, isSupportedLang };
EOF
