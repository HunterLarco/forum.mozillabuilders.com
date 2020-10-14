import errorHandler from '@/src/server/helpers/net/errorHandler';
import validateRequest from '@/src/server/helpers/net/validateRequest';

export default class RedirectEndpoint {
  constructor(environment, handler, { RequestSchema, plugins }) {
    this.environment = environment;
    this.handler_ = handler;
    this.RequestSchema = RequestSchema;
    this.plugins = plugins || {};

    this.handler = this.handler.bind(this);
  }

  static factory(handler, options) {
    return (environment) => new RedirectEndpoint(environment, handler, options);
  }

  handler(request, response, next) {
    const runAsync = async () => {
      const validatedRequest = validateRequest(request, this.RequestSchema);

      const pluginResults = {};
      for (const [name, plugin] of Object.entries(this.plugins)) {
        pluginResults[name] = await plugin(
          this.environment,
          validatedRequest,
          request.headers
        );
      }

      const redirectUrl = await this.handler_(
        this.environment,
        validatedRequest,
        pluginResults
      );

      if (redirectUrl) {
        response.redirect(redirectUrl.toString());
      } else {
        response.end();
      }
    };

    runAsync()
      .then((payload) => response.send(payload))
      .catch((error) => errorHandler(response, error));
  }
}
