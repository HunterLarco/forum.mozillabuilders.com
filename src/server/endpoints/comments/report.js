import Joi from 'joi';
import Mustache from 'mustache';

import JsonEndpoint from '@/src/server/helpers/net/JsonEndpoint';
import getCurrentUser from '@/src/server/helpers/net/getCurrentUser';

import * as PostTable from '@/src/server/firestore/Post';

import * as commentHelpers from '@/src/server/helpers/data/Comment';

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

  const postId = commentHelpers.postId(request.id);
  const { post } = await PostTable.get(environment, null, postId);

  if (!post) {
    return Promise.reject({
      httpErrorCode: 404,
      name: 'PostNotFound',
      message: `Post ${postId} not found`,
    });
  }

  const comment = commentHelpers.find(post, request.id);

  if (!comment) {
    return Promise.reject({
      httpErrorCode: 404,
      name: 'CommentNotFound',
      message: `Comment ${request.id} not found`,
    });
  }

  const username = actor ? `@${actor.username}` : 'An anonymous user';
  const contentUrl = `https://forum.mozillabuilders.com/comment/${request.id}`;

  if (process.fido.env == 'local') {
    console.log(`${username} reported content:`);
    console.log(`    Content Url: ${contentUrl}`);
  } else {
    await environment.sparkpost.send({
      to: 'builders-forum@mozilla.com',
      subject: `${username} reported content`,
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
