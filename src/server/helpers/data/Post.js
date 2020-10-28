import * as stringHelpers from '@/src/server/helpers/strings';

export function create(title, content, accountId) {
  const post = {
    author: accountId,
    title,
    content: {},
    comments: [],
    stats: {
      likes: 1,
      hotness: 0,
    },
    dateCreated: new Date(),
  };

  if (content.link) {
    post.content.link = content.link;
  } else if (content.text) {
    post.content.text = content.text;
  } else {
    throw new Error(`Unknown post content format ${JSON.stringify(content)}`);
  }

  return post;
}
