import VueRouter from 'vue-router';

import CurrentUserStore from '@/src/web/stores/CurrentUser';

const router = new VueRouter({
  mode: 'history',
  routes: [
    {
      path: '/hot',
      component: () => import('@/src/web/components/pages/Landing'),
    },

    {
      path: '/new',
      component: () => import('@/src/web/components/pages/Landing'),
    },

    {
      path: '/post/:id',
      component: () => import('@/src/web/components/pages/Post'),
    },

    {
      path: '/user/:id',
      component: () => import('@/src/web/components/pages/User'),
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
      path: '/logout',
      beforeEnter(to, from, next) {
        CurrentUserStore.dispatch('logout').then(() => {
          next('/');
        });
      },
    },

    {
      path: '*',
      redirect: '/hot',
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
