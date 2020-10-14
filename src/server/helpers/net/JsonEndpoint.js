import errorHandler from '@/src/server/helpers/net/errorHandler';
import validateJsonResponse from '@/src/server/helpers/net/validateJsonResponse';
import validateRequest from '@/src/server/helpers/net/validateRequest';

export default class JsonEndpoint {
  constructor(
    environment,
    handler,
    { RequestSchema, ResponseSchema, plugins }
  ) {
    this.environment = environment;
    this.handler_ = handler;
    this.RequestSchema = RequestSchema;
    this.ResponseSchema = ResponseSchema;
    this.plugins = plugins || {};

    this.handler = this.handler.bind(this);
  }

  static factory(handler, options) {
    return (environment) => new JsonEndpoint(environment, handler, options);
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

      return validateJsonResponse(
        await this.handler_(this.environment, validatedRequest, pluginResults),
        this.ResponseSchema
      );
    };

    runAsync()
      .then((payload) => response.send(payload))
      .catch((error) => errorHandler(response, error));
  }
}
