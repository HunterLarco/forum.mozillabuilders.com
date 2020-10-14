import VueRouter from 'vue-router';

export default new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/top',
      component: () => import('@/src/web/components/pages/Landing'),
    },

    {
      path: '/new',
      component: () => import('@/src/web/components/pages/Landing'),
    },

    {
      path: '/submit',
      component: () => import('@/src/web/components/pages/Submit'),
    },

    {
      path: '*',
      redirect: '/top',
    },
  ],
});
