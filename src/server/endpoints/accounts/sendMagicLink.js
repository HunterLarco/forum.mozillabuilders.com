import * as dateFns from 'date-fns';
import Joi from 'joi';
import Mustache from 'mustache';

import JsonEndpoint from '@/src/server/helpers/net/JsonEndpoint';

import * as AccountIdentityTable from '@/src/server/firestore/AccountIdentity';
import * as AuthTokenTable from '@/src/server/firestore/AuthToken';
import * as passwordHelpers from '@/src/server/helpers/password';
import FirestoreEmailSchema from '@/src/server/types/firestore/Email';

import HTMLMagicLinkEmail from '@/src/server/emails/MagicLink.mjml';
import PlainTextMagicLinkEmail from '@/src/server/emails/MagicLink.txt';

const RequestSchema = Joi.object({
  email: Joi.string().email().required(),
});

const ResponseSchema = Joi.object({});

async function handler(environment, request) {
  const email = FirestoreEmailSchema.fromText(request.email);

  const { accountIdentity } = await AccountIdentityTable.get(
    environment,
    null,
    'normalizedEmail',
    email.normalized
  );

  if (!accountIdentity) {
    return Promise.reject({
      httpErrorCode: 404,
      name: 'AccountNotFound',
      message: `No account found for email ${email.raw}`,
    });
  }

  // Rather than magic links, we email users a passphrase which can be used to
  // login. This much easier on mobile users.
  const password = passwordHelpers.createFriendlyPassword();

  const { id: loginToken } = await AuthTokenTable.create(
    environment,
    {
      dateCreated: new Date(),
      expiration: dateFns.addDays(new Date(), 1),
      scopes: {
        login: {
          accountId: accountIdentity.accountId,
        },
      },
    },
    {
      compositeKey: {
        email: email.normalized,
        password,
      },
    }
  );

  if (process.fido.env == 'local') {
    console.log(`Login information for ${email.raw}:`);
    console.log(`    Temporary password: ${password}`);
    console.log(`    Login token: ${loginToken}`);
  } else {
    await environment.sendgrid.send({
      to: email.raw,
      subject: 'Your temporary Mozilla Unfck Forum login link',
      text: Mustache.render(PlainTextMagicLinkEmail, {
        loginUrl: `https://unfck.xyz/login/${loginToken}`,
      }),
      html: Mustache.render(HTMLMagicLinkEmail, {
        loginUrl: `https://unfck.xyz/login/${loginToken}`,
      }),
    });
  }

  return {};
}

export default JsonEndpoint.factory(handler, {
  RequestSchema,
  ResponseSchema,
});
