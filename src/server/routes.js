export function install(environment, app) {
  const ROUTES = [];

  for (const [method, path, endpointFactory] of ROUTES) {
    app[method](path, endpointFactory(environment).handler);
  }
}
