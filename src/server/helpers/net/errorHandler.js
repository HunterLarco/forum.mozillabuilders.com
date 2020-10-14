export default function errorHandler(response, error) {
  if (error.httpErrorCode && error.name) {
    response.status(error.httpErrorCode);
    response.send({
      name: error.name,
      message: error.message || error.name,
    });
    return;
  }

  if (error instanceof Error) {
    console.error(error);
  } else if (error instanceof Object) {
    console.error(new Error(`Unknown api error: ${JSON.stringify(error)}`));
  } else {
    console.error(new Error(`Unknown api error: ${error}`));
  }

  response.status(500);
  response.send({
    name: 'Unknown',
    message: 'Unknown error',
  });
}
