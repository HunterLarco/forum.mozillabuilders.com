import VueRouter from 'vue-router';

import CurrentUserStore from '@/src/web/stores/CurrentUser';

const router = new VueRouter({
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
      path: '/posts/:id',
      component: () => import('@/src/web/components/pages/Post'),
    },

    {
      path: '/submit',
      component: () => import('@/src/web/components/pages/Submit'),
      meta: {
        auth: {
          required: true,
          redirect: '/signup',
          message: 'You must be logged in to post.',
        },
      },
    },

    {
      path: '/login',
      component: () => import('@/src/web/components/pages/Login'),
    },

    {
      path: '/login/:token',
      component: () => import('@/src/web/components/pages/LoginWithToken'),
    },

    {
      path: '/signup',
      component: () => import('@/src/web/components/pages/Signup'),
    },

    {
      path: '*',
      redirect: '/top',
    },
  ],
});

router.beforeEach((to, from, next) => {
  if (
    to.meta &&
    to.meta.auth &&
    to.meta.auth.required &&
    !CurrentUserStore.state.authToken
  ) {
    next({
      path: to.meta.auth.redirect || '/login',
      query: {
        info: to.meta.auth.message,
      },
    });
  } else {
    next();
  }
});

export default router;
