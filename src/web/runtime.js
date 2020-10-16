import 'intersection-observer';

import Vue from 'vue';
import VueObserveVisibility from 'vue-observe-visibility';
import VueRouter from 'vue-router';
import Vuex from 'vuex';

Vue.use(VueObserveVisibility);
Vue.use(VueRouter);
Vue.use(Vuex);

Vue.use(require('@/src/web/plugins/VueSizingPlugin').default);

if (process.fido.env == 'local') {
  require('@/src/web/debug/console');
}

const WindowSizeStore = require('@/src/web/stores/WindowSize').default;
WindowSizeStore.dispatch('autoUpdateWidth');
