import md5 from 'md5';
import { v4 as uuidv4 } from 'uuid';

import * as stringHelpers from '@/src/server/helpers/strings';

export function create(postId, text, accountId) {
  return {
    id: `${postId}-${md5(uuidv4())}`,
    author: accountId,
    content: { text: stringHelpers.collapseWhitespace(text) },
    children: [],
    dateCreated: new Date(),
  };
}

export function find(post, commentId) {
  const searchChildren = (children) => {
    for (const child of children) {
      if (child.id == commentId) {
        return child;
      }

      const deepResult = searchChildren(child.children);
      if (deepResult) {
        return deepResult;
      }
    }

    return null;
  };

  return searchChildren(post.comments);
}

export function count(comments) {
  let result = comments.length;
  for (const child of comments) {
    result += count(child.children);
  }
  return result;
}

export function postId(commentId) {
  return commentId.split('-')[0];
}
