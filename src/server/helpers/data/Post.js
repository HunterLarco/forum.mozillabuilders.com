import * as stringHelpers from '@/src/server/helpers/strings';

export function create(content, accountId) {
  const post = {
    author: accountId,
    content: {},
    comments: [],
    stats: {
      likes: 1,
      hotness: 0,
    },
    dateCreated: new Date(),
  };

  if (content.type == 'question') {
    post.content.type = 'question';
    post.content.question = stringHelpers.collapseWhitespace(content.question);
    post.content.details = stringHelpers.collapseWhitespace(content.details);
  } else if (content.type == 'url') {
    post.content.type = 'url';
    post.content.summary = stringHelpers.collapseWhitespace(content.summary);
    post.content.url = request.url;
  } else if (content.type == 'opinion') {
    post.content.type = 'opinion';
    post.content.summary = stringHelpers.collapseWhitespace(content.summary);
    post.content.details = stringHelpers.collapseWhitespace(content.details);
  }

  return post;
}
