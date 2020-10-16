import accounts_create from '@/src/server/endpoints/accounts/create';
import accounts_login from '@/src/server/endpoints/accounts/login';
import accounts_sendMagicLink from '@/src/server/endpoints/accounts/sendMagicLink';
import cron_rankHotPosts from '@/src/server/endpoints/cron/rankHotPosts';
import posts_comment from '@/src/server/endpoints/posts/comment';
import posts_create from '@/src/server/endpoints/posts/create';
import posts_get from '@/src/server/endpoints/posts/get';
import posts_like from '@/src/server/endpoints/posts/like';
import posts_query from '@/src/server/endpoints/posts/query';

export function install(environment, app) {
  const ROUTES = [
    ['post', '/aurora/accounts/create', accounts_create],
    ['post', '/aurora/accounts/login', accounts_login],
    ['post', '/aurora/accounts/sendMagicLink', accounts_sendMagicLink],
    ['get', '/aurora/cron/rankHotPosts', cron_rankHotPosts],
    ['post', '/aurora/posts/comment', posts_comment],
    ['post', '/aurora/posts/create', posts_create],
    ['post', '/aurora/posts/get', posts_get],
    ['post', '/aurora/posts/like', posts_like],
    ['post', '/aurora/posts/query', posts_query],
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
