import accounts_create from '@/src/server/endpoints/accounts/create';
import accounts_ban from '@/src/server/endpoints/accounts/ban';
import accounts_get from '@/src/server/endpoints/accounts/get';
import accounts_getMe from '@/src/server/endpoints/accounts/getMe';
import accounts_login from '@/src/server/endpoints/accounts/login';
import accounts_sendMagicLink from '@/src/server/endpoints/accounts/sendMagicLink';
import accounts_unban from '@/src/server/endpoints/accounts/unban';
import comments_create from '@/src/server/endpoints/comments/create';
import comments_like from '@/src/server/endpoints/comments/like';
import comments_unlike from '@/src/server/endpoints/comments/unlike';
import cron_rankHotPosts from '@/src/server/endpoints/cron/rankHotPosts';
import notifications_queryMine from '@/src/server/endpoints/notifications/queryMine';
import notifications_read from '@/src/server/endpoints/notifications/read';
import posts_ban from '@/src/server/endpoints/posts/ban';
import posts_create from '@/src/server/endpoints/posts/create';
import posts_get from '@/src/server/endpoints/posts/get';
import posts_like from '@/src/server/endpoints/posts/like';
import posts_query from '@/src/server/endpoints/posts/query';
import posts_unban from '@/src/server/endpoints/posts/unban';
import posts_unlike from '@/src/server/endpoints/posts/unlike';

export function install(environment, app) {
  const ROUTES = [
    ['get', '/aurora/cron/rankHotPosts', cron_rankHotPosts],
    ['post', '/aurora/accounts/ban', accounts_ban],
    ['post', '/aurora/accounts/create', accounts_create],
    ['post', '/aurora/accounts/get', accounts_get],
    ['post', '/aurora/accounts/getMe', accounts_getMe],
    ['post', '/aurora/accounts/login', accounts_login],
    ['post', '/aurora/accounts/sendMagicLink', accounts_sendMagicLink],
    ['post', '/aurora/accounts/unban', accounts_unban],
    ['post', '/aurora/comments/create', comments_create],
    ['post', '/aurora/comments/like', comments_like],
    ['post', '/aurora/comments/unlike', comments_unlike],
    ['post', '/aurora/notifications/queryMine', notifications_queryMine],
    ['post', '/aurora/notifications/read', notifications_read],
    ['post', '/aurora/posts/ban', posts_ban],
    ['post', '/aurora/posts/create', posts_create],
    ['post', '/aurora/posts/get', posts_get],
    ['post', '/aurora/posts/like', posts_like],
    ['post', '/aurora/posts/query', posts_query],
    ['post', '/aurora/posts/unban', posts_unban],
    ['post', '/aurora/posts/unlike', posts_unlike],
  ];

  for (const [method, path, endpointFactory] of ROUTES) {
    const endpoint = endpointFactory(environment);
    app[method](path, endpoint.handler);

    if (process.fido.env == 'local' && path.match(/^\/[^/]+\/cron\//)) {
      scheduleCronJob(path, endpoint);
    }
  }
}

// This should only be used when running locally.
function scheduleCronJob(path, endpoint) {
  const log = (...args) => {
    console.log(`LOCAL_CRON ${new Date().toISOString()} ${path}`, ...args);
  };

  setInterval(() => {
    log('Starting');
    endpoint
      .fake({}, { 'x-appengine-cron': 'true' })
      .then(() => log('Finished'))
      .catch((error) => log('Failed with error:', error));
  }, 15 * 1000);
}
