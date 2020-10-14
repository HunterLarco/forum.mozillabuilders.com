export default function validateRequest(request, RequestSchema) {
  const requestPayload = getRequestPayload(request);

  const { value: validatedPayload, error } = RequestSchema.validate(
    requestPayload
  );
  if (error) {
    throw {
      httpErrorCode: 400,
      name: 'BadRequest',
      message: error.message,
    };
  }

  return validatedPayload;
}

function getRequestPayload(request) {
  switch (request.method) {
    case 'GET':
      return request.query;
      break;
    case 'POST':
      return request.body;
      break;
    default:
      throw new Error(`Unsure how to validate ${request.method} request.`);
  }
}
