import errorHandler from '@/src/server/helpers/net/errorHandler';
import validateJsonResponse from '@/src/server/helpers/net/validateJsonResponse';
import validateRequest from '@/src/server/helpers/net/validateRequest';

export default class JsonEndpoint {
  constructor(environment, handler, { RequestSchema, ResponseSchema }) {
    this.environment = environment;
    this.handler_ = handler;
    this.RequestSchema = RequestSchema;
    this.ResponseSchema = ResponseSchema;

    this.handler = this.handler.bind(this);
  }

  static factory(handler, options) {
    return (environment) => new JsonEndpoint(environment, handler, options);
  }

  handler(request, response, next) {
    const runAsync = async () => {
      const validatedRequest = validateRequest(request, this.RequestSchema);
      return validateJsonResponse(
        await this.handler_(
          this.environment,
          validatedRequest,
          request.headers
        ),
        this.ResponseSchema
      );
    };

    runAsync()
      .then((payload) => response.send(payload))
      .catch((error) => errorHandler(response, error));
  }

  async fake(request, headers) {
    const validatedRequest = validateRequest(
      { method: 'POST', body: request },
      this.RequestSchema
    );

    return await this.handler_(this.environment, validatedRequest, headers);
  }
}
