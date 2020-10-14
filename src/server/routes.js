import posts_create from '@/src/server/endpoints/posts/create';
import posts_get from '@/src/server/endpoints/posts/get';
import posts_query from '@/src/server/endpoints/posts/query';

export function install(environment, app) {
  const ROUTES = [
    ['post', '/aurora/posts/create', posts_create],
    ['post', '/aurora/posts/get', posts_get],
    ['post', '/aurora/posts/query', posts_query],
  ];

  for (const [method, path, endpointFactory] of ROUTES) {
    app[method](path, endpointFactory(environment).handler);
  }
}
