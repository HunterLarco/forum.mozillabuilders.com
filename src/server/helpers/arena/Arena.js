import flushAccount from '@/src/server/helpers/arena/flushAccount';
import flushComment from '@/src/server/helpers/arena/flushComment';
import flushPost from '@/src/server/helpers/arena/flushPost';

import * as commentHelpers from '@/src/server/helpers/data/Comment';

export default class Arena {
  constructor(environment) {
    this.environment = environment;
    this.actor = null;
    this.accounts = {};
    this.posts = {};
    this.comments = {};
  }

  setActor(id, account) {
    this.actor = { id, account };
    this.addAccount(id, account);
  }

  addPost(id, firestore) {
    if (this.posts[id]) {
      return this.posts[id];
    }

    const post = {
      id,
      flushed: false,
      firestore,
      author: this.addAccount(firestore.author),
    };

    for (const comment of commentHelpers.iterate(firestore.comments)) {
      this.addComment(comment);
    }

    this.posts[id] = post;
    return post;
  }

  addAccount(id, opt_firestore) {
    if (this.accounts[id]) {
      return this.accounts[id];
    }

    const account = {
      id,
      flushed: false,
      firestore: opt_firestore,
    };

    this.accounts[id] = account;
    return account;
  }

  addComment(firestore) {
    if (this.comments[firestore.id]) {
      return this.comments[firestore.id];
    }

    const comment = {
      id: firestore.id,
      flushed: false,
      firestore,
      author: this.addAccount(firestore.author),
    };

    this.comments[firestore.id] = comment;
    return comment;
  }

  async flush() {
    await Promise.all(
      Object.values(this.accounts).map((account) => flushAccount(this, account))
    );

    await Promise.all(
      Object.values(this.comments).map((comment) => flushComment(this, comment))
    );

    await Promise.all(
      Object.values(this.posts).map((post) => flushPost(this, post))
    );
  }
}
