// amp-intake/handlers/_response.js

// TODO: 아래 import 경로는 너 프로젝트 실제 위치에 맞게 조정해야 함.
// 예: ../sot/renderMessage.js 또는 ../lib/renderMessage.js 등
import { renderMessage } from '../sot/renderMessage.js';

export function buildResponse({ status, messageKey, lang = 'en', params = {}, data }) {
  const body = {
    status,
    messageKey,
    message: renderMessage(messageKey, params, lang),
  };

  if (data !== undefined) body.data = data;
  return body;
}
