import SparkPost from 'sparkpost';

import * as secretHelpers from '@/src/server/helpers/secrets';

export async function createSparkpostClient() {
  const client = new SparkPost(
    await secretHelpers.get('sparkpost-master-key'),
    {}
  );

  return {
    async send({ to, subject, html, text }) {
      if (!text) {
        // Even when sending html email, the lack of plaintext fallback
        // massively hurts our spam score.
        throw new Error(
          'Refusing to send email without plaintext version included.'
        );
      }

      return client.transmissions.send({
        recipients: [{ address: { email: to } }],
        content: {
          from: {
            name: 'Mozilla Builders',
            email: 'noreply@mail.mozillabuilders.com',
          },
          subject,
          html,
          text,
        },
      });
    },
  };
}
