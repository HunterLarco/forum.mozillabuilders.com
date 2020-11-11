import CurrentUserStore from '@/src/web/stores/CurrentUser';
import FeedStore from '@/src/web/stores/Feed';
import PublicUsersStore from '@/src/web/stores/PublicUsers';
import WindowSizeStore from '@/src/web/stores/WindowSize';

window.__mozillabuilders__ = {
  stores: {
    CurrentUserStore,
    FeedStore,
    PublicUsersStore,
    WindowSizeStore,
  },
};
