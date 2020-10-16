import { v4 as uuidv4 } from 'uuid';

export function create(text, accountId) {
  return {
    id: uuidv4(),
    author: accountId,
    content: { text },
    children: [],
    dateCreated: new Date(),
  };
}

export function findComment(post, commentId) {
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
