import SendGrid from '@sendgrid/mail';

import * as secretHelpers from '@/src/server/helpers/secrets';

export async function createSendgridClient() {
  SendGrid.setApiKey(await secretHelpers.get('sendgrid-master-key'));

  return {
    async send({ to, subject, html, text }) {
      if (!text) {
        // Even when sending html email, the lack of plaintext fallback
        // massively hurts our spam score.
        throw new Error(
          'Refusing to send email without plaintext version included.'
        );
      }

      await SendGrid.send({
        to,
        from: {
          name: 'Mozilla Unfck',
          email: 'noreply@mail.unfck.xyz',
        },
        subject,
        html,
        text,
      });
    },
  };
}
