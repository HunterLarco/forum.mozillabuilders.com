import 'intersection-observer';

import Vue from 'vue';
import VueAsyncComputed from 'vue-async-computed';
import VueObserveVisibility from 'vue-observe-visibility';
import VueRouter from 'vue-router';
import Vuex from 'vuex';

Vue.use(VueAsyncComputed);
Vue.use(VueObserveVisibility);
Vue.use(VueRouter);
Vue.use(Vuex);

Vue.use(require('@/src/web/plugins/VueSizingPlugin').default);

if (process.fido.env == 'local') {
  require('@/src/web/debug/console');
}

const WindowSizeStore = require('@/src/web/stores/WindowSize').default;
WindowSizeStore.dispatch('autoUpdateWidth');

const CurrentUserStore = require('@/src/web/stores/CurrentUser').default;
if (CurrentUserStore.state.authToken) {
  CurrentUserStore.dispatch('getAccount');
}
