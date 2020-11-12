import pLimit from 'p-limit';

import {
  prepareAccount,
  flushAccount,
} from '@/src/server/helpers/arena/flushAccount';
import {
  prepareComment,
  flushComment,
} from '@/src/server/helpers/arena/flushComment';
import {
  prepareNotification,
  flushNotification,
} from '@/src/server/helpers/arena/flushNotification';
import { preparePost, flushPost } from '@/src/server/helpers/arena/flushPost';

import * as commentHelpers from '@/src/server/helpers/data/Comment';

export default class Arena {
  constructor(environment) {
    this.environment = environment;
    this.actor = null;
    this.accounts = {};
    this.posts = {};
    this.comments = {};
    this.notifications = {};
  }

  setActor(id, account) {
    this.actor = { id, account };
    this.addAccount(id, account);
  }

  addPost(id, opt_firestore) {
    if (this.posts[id]) {
      return this.posts[id];
    }

    const post = {
      id,
      prepared: false,
      flushed: false,
      firestore: opt_firestore || null,
    };

    this.posts[id] = post;
    return post;
  }

  addAccount(id, opt_firestore) {
    if (this.accounts[id]) {
      return this.accounts[id];
    }

    const account = {
      id,
      prepared: false,
      flushed: false,
      firestore: opt_firestore || null,
    };

    this.accounts[id] = account;
    return account;
  }

  addComment(id, opt_firestore) {
    if (this.comments[id]) {
      return this.comments[id];
    }

    const comment = {
      id,
      prepared: false,
      flushed: false,
      firestore: opt_firestore || null,
    };

    this.comments[id] = comment;
    return comment;
  }

  addNotification(id, opt_firestore) {
    if (this.notifications[id]) {
      return this.notifications[id];
    }

    const notification = {
      id,
      prepared: false,
      flushed: false,
      firestore: opt_firestore || null,
    };

    this.notifications[id] = notification;
    return notification;
  }

  async flush() {
    const limit = pLimit(20);
    let tasks = [];

    do {
      await Promise.all(tasks.map((task) => limit(task)));
      tasks = [];

      for (const notification of Object.values(this.notifications)) {
        if (!notification.prepared) {
          tasks.push(() => prepareNotification(this, notification));
        }
      }

      for (const account of Object.values(this.accounts)) {
        if (!account.prepared) {
          tasks.push(() => prepareAccount(this, account));
        }
      }

      for (const comment of Object.values(this.comments)) {
        if (!comment.prepared) {
          tasks.push(() => prepareComment(this, comment));
        }
      }

      for (const post of Object.values(this.posts)) {
        if (!post.prepared) {
          tasks.push(() => preparePost(this, post));
        }
      }
    } while (tasks.length);

    await Promise.all(
      Object.values(this.notifications).map((notification) =>
        flushNotification(this, notification)
      )
    );

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
