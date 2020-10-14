export default function validateJsonResponse(json, ResponseSchema) {
  if (process.fido.env == 'production') {
    // Always assume the response is valid in production. Best to serve
    // traffic rather than break production for type safety.
    return json;
  }

  const { value: validatedJson, error } = ResponseSchema.validate(json);
  if (error) {
    console.log(`BadResponse: ${error.message}`, json);
    throw {
      httpErrorCode: 500,
      name: 'BadResponse',
      message: error.message,
    };
  }

  return validatedJson;
}
