import CurrentUserStore from '@/src/web/stores/CurrentUser';
import WindowSizeStore from '@/src/web/stores/WindowSize';

window.__unfck__ = {
  stores: {
    CurrentUserStore,
    WindowSizeStore,
  },
};
