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

export function* iterate(comments) {
  for (const comment of comments) {
    yield comment;
    for (const subcomment of iterate(comment.children)) {
      yield subcomment;
    }
  }
}

export function postId(commentId) {
  return commentId.split('-')[0];
}

export function path(comments, commentId) {
  for (const comment of comments) {
    if (comment.id == commentId) {
      return [comment];
    }

    const subPath = path(comment.children, commentId);
    if (subPath.length) {
      return [comment, ...subPath];
    }
  }

  return [];
}
