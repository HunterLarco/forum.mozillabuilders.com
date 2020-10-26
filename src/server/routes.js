import accounts_create from '@/src/server/endpoints/accounts/create';
import accounts_login from '@/src/server/endpoints/accounts/login';
import accounts_sendMagicLink from '@/src/server/endpoints/accounts/sendMagicLink';
import comments_like from '@/src/server/endpoints/comments/like';
import comments_unlike from '@/src/server/endpoints/comments/unlike';
import cron_rankHotPosts from '@/src/server/endpoints/cron/rankHotPosts';
import posts_comment from '@/src/server/endpoints/posts/comment';
import posts_create from '@/src/server/endpoints/posts/create';
import posts_get from '@/src/server/endpoints/posts/get';
import posts_like from '@/src/server/endpoints/posts/like';
import posts_query from '@/src/server/endpoints/posts/query';
import posts_unlike from '@/src/server/endpoints/posts/unlike';

export function install(environment, app) {
  const ROUTES = [
    ['get', '/aurora/cron/rankHotPosts', cron_rankHotPosts],
    ['post', '/aurora/accounts/create', accounts_create],
    ['post', '/aurora/accounts/login', accounts_login],
    ['post', '/aurora/accounts/sendMagicLink', accounts_sendMagicLink],
    ['post', '/aurora/comments/like', comments_like],
    ['post', '/aurora/comments/unlike', comments_unlike],
    ['post', '/aurora/posts/comment', posts_comment],
    ['post', '/aurora/posts/create', posts_create],
    ['post', '/aurora/posts/get', posts_get],
    ['post', '/aurora/posts/like', posts_like],
    ['post', '/aurora/posts/query', posts_query],
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
