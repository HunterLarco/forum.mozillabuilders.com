import Joi from 'joi';

import JsonEndpoint from '@/src/server/helpers/net/JsonEndpoint';
import getCurrentUser from '@/src/server/helpers/net/getCurrentUser';

import * as PostTable from '@/src/server/firestore/Post';

import HTMLReportedContentEmail from '@/src/server/emails/ReportedContent.mjml';
import PlainTextReportedContentEmail from '@/src/server/emails/ReportedContent.txt';

const RequestSchema = Joi.object({
  id: Joi.string().required(),
});

const ResponseSchema = Joi.object({});

async function handler(environment, request, headers) {
  const { id: actorId, account: actor } = await getCurrentUser(
    environment,
    headers,
    { required: false }
  );

  const { post } = await PostTable.get(environment, null, request.id);

  if (!post) {
    return Promise.reject({
      httpErrorCode: 404,
      name: 'PostNotFound',
      message: `Post ${request.id} not found`,
    });
  }

  const username = actor ? `@${actor.username}` : 'An anonymous user';
  const contentUrl = `https://forum.mozillabuilders.com/post/${request.id}`;

  if (process.fido.env == 'local') {
    console.log(`${username} reported content:`);
    console.log(`    Content Url: ${contentUrl}`);
  } else {
    await environment.sparkpost.send({
      to: 'builders-forum@mozilla.com',
      subject: `@${username} reported content`,
      text: Mustache.render(PlainTextReportedContentEmail, {
        username,
        contentUrl,
      }),
      html: Mustache.render(HTMLReportedContentEmail, { username, contentUrl }),
    });
  }

  return {};
}

export default JsonEndpoint.factory(handler, {
  RequestSchema,
  ResponseSchema,
});
