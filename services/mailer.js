'use strict';

async function sendReportEmail({ to, subject, html, links, meta }) {
  // TODO: Replace with SendGrid transactional send flow.
  // TODO: Load SENDGRID_API_KEY and FROM_EMAIL from environment variables.
  if (process.env.NODE_ENV !== 'production') {
    console.log('[mailer:stub] sendReportEmail', {
      to,
      subject,
      htmlLength: typeof html === 'string' ? html.length : 0,
      links,
      meta,
    });
  }

  return { messageId: 'stub-message-id' };
}

module.exports = { sendReportEmail };
