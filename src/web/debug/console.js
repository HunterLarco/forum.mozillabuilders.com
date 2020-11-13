import CurrentUserStore from '@/src/web/stores/CurrentUser';
import FeedStore from '@/src/web/stores/Feed';
import NotificationStore from '@/src/web/stores/Notification';
import PostStore from '@/src/web/stores/Post';
import PublicUserStore from '@/src/web/stores/PublicUser';
import WindowSizeStore from '@/src/web/stores/WindowSize';

window.__mozillabuilders__ = {
  stores: {
    CurrentUserStore,
    FeedStore,
    NotificationStore,
    PostStore,
    PublicUserStore,
    WindowSizeStore,
  },
};
