'use strict';

const SOT = {
  global: {
    defaultLang: 'en',
    unimplementedStatusKey: 'pending',
  },

  statusKeys: {
    pending: { behavior: 'warn' },
    success: { behavior: 'normal' },
    error: { behavior: 'fail' },
    simulated: { behavior: 'normal' },
  },

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
