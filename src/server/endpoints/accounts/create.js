import * as dateFns from 'date-fns';
import Joi from 'joi';
import Mustache from 'mustache';

import JsonEndpoint from '@/src/server/helpers/net/JsonEndpoint';

import * as AccountIdentityTable from '@/src/server/firestore/AccountIdentity';
import * as AuthTokenTable from '@/src/server/firestore/AuthToken';
import FirestoreEmailSchema from '@/src/server/types/firestore/Email';

import HTMLMagicLinkEmail from '@/src/server/emails/MagicLink.mjml';
import PlainTextMagicLinkEmail from '@/src/server/emails/MagicLink.txt';

const RequestSchema = Joi.object({
  email: Joi.string().email().required(),
  username: Joi.string().required(),
});

const ResponseSchema = Joi.object({});

async function handler(environment, request) {
  if (request.username.length < 3) {
    return Promise.reject({
      httpErrorCode: 400,
      name: 'InvalidUsername',
      message: 'Usernames must contain at least 3 characters',
    });
  } else if (!request.username.match(/^[a-zA-Z0-9_]+$/)) {
    return Promise.reject({
      httpErrorCode: 400,
      name: 'InvalidUsername',
      message: 'May only contain alphanumeric characters and underscores.',
    });
  } else if (request.username.toLowerCase() == 'you') {
    return Promise.reject({
      httpErrorCode: 400,
      name: 'InvalidUsername',
      message: `${request.username} is unavailable.`,
    });
  }

  const email = FirestoreEmailSchema.fromText(request.email);

  if (
    await AccountIdentityTable.exists(
      environment,
      null,
      'normalizedEmail',
      email.normalized
    )
  ) {
    return Promise.reject({
      httpErrorCode: 412,
      name: 'EmailAlreadyExists',
      message: `Account already exists for email ${email.raw}`,
    });
  } else if (
    await AccountIdentityTable.exists(
      environment,
      null,
      'username',
      request.username
    )
  ) {
    return Promise.reject({
      httpErrorCode: 412,
      name: 'UsernameAlreadyExists',
      message: `${request.username} is unavailable.`,
    });
  }

  const { id: loginToken } = await AuthTokenTable.create(environment, null, {
    dateCreated: new Date(),
    expiration: dateFns.addDays(new Date(), 1),
    scopes: {
      signup: {
        email,
        username: request.username,
      },
    },
  });

  if (process.fido.env == 'local') {
    console.log(
      `Login url for ${email.raw}: http://localhost:8080/login/${loginToken}`
    );
  } else {
    await environment.sparkpost.send({
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
