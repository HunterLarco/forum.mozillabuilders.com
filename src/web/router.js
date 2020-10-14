import VueRouter from 'vue-router';

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '*',
      component: () => import('@/src/web/components/pages/Landing'),
    },
  ],
});
