import * as stringHelpers from '@/src/server/helpers/strings';

export function create(title, content, accountId) {
  const post = {
    author: accountId,
    title: stringHelpers.collapseWhitespace(title),
    comments: [],
    stats: {
      likes: 1,
      hotness: 0,
    },
    dateCreated: new Date(),
  };

  if (content.text) {
    post.content = { text: stringHelpers.collapseWhitespace(content.text) };
  } else if (content.link) {
    post.content = { link: content.link };
  } else {
    throw new Error('Unable to create new post: invalid content');
  }

  return post;
}
