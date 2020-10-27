import CurrentUserStore from '@/src/web/stores/CurrentUser';
import FeedStore from '@/src/web/stores/Feed';
import WindowSizeStore from '@/src/web/stores/WindowSize';

window.__mozillabuilders__ = {
  stores: {
    CurrentUserStore,
    FeedStore,
    WindowSizeStore,
  },
};
