import * as NotificationTable from '@/src/server/firestore/Notification';

export async function prepareNotification(arena, notification) {
  if (notification.prepared) {
    return false;
  }

  if (!notification.firestore) {
    notification.firestore = (
      await NotificationTable.get(arena.environment, null, notification.id)
    ).notification;
  }

  notification.recipient = arena.addAccount(notification.firestore.recipient);
  if (notification.firestore.type == 'reply') {
    arena.addAccount(notification.firestore.details.author);
    arena.addComment(notification.firestore.details.content.comment);
    if (notification.firestore.details.target.post) {
      arena.addPost(notification.firestore.details.target.post);
    } else {
      arena.addComment(notification.firestore.details.target.comment);
    }
  }

  notification.prepared = true;
  return true;
}

export async function flushNotification(arena, notification) {
  if (!notification.prepared) {
    throw new Error('Notification must be prepared before flushed');
  }

  if (notification.flushed) {
    return false;
  }

  notification.flushed = true;
  return true;
}
