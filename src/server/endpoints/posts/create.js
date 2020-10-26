import Joi from 'joi';

import JsonEndpoint from '@/src/server/helpers/net/JsonEndpoint';
import getCurrentUser from '@/src/server/helpers/net/getCurrentUser';

import * as PostTable from '@/src/server/firestore/Post';
import * as postHelpers from '@/src/server/helpers/data/Post';

const RequestSchema = Joi.object({
  title: Joi.string().required(),

  content: Joi.object({
    text: Joi.string(),
    link: Joi.string().uri(),
  })
    .xor('text', 'link')
    .required(),

  group: Joi.string()
    .allow(
      'collaboration-and-society',
      'decentralized-web',
      'messaging-and-social-networking',
      'surveillance-capitalism',
      'misinformation-and-content',
      'artificial-intelligence',
      'web-assembly',
      'search'
    )
    .required(),
});

const ResponseSchema = Joi.object({
  id: Joi.string().required(),
});

async function handler(environment, request, headers) {
  const { id: accountId } = await getCurrentUser(environment, headers, {
    required: true,
  });

  const { id } = await PostTable.create(
    environment,
    null,
    postHelpers.create(request.title, request.content, accountId)
  );

  return { id };
}

export default JsonEndpoint.factory(handler, {
  RequestSchema,
  ResponseSchema,
});
