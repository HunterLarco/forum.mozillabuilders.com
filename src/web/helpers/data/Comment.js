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
