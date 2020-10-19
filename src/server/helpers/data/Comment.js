import * as dateFns from 'date-fns';
import { v4 as uuidv4 } from 'uuid';

import * as stringHelpers from '@/src/server/helpers/strings';

export function create(text, accountId) {
  return {
    id: uuidv4(),
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

export function reorder(comments) {
  comments.sort((a, b) =>
    dateFns.compareDesc(new Date(a.dateCreated), new Date(b.dateCreated))
  );
  for (const comment of comments) {
    reorder(comment.children);
  }
}
