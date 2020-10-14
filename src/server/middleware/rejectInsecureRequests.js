export default function middleware() {
  return (request, response, next) => {
    if (request.hostname == 'localhost' && process.fido.env == 'local') {
      return next();
    }

    if (isSecure(request)) {
      return next();
    }

    response.status(426).send('Upgrade Required');
  };
}

function isSecure(request) {
  // Check the trivial case first.
  if (request.secure) {
    return true;
  }

  // Check if we are behind Application Request Routing (ARR).
  // This is typical for Azure.
  if (request.headers['x-arr-log-id']) {
    return typeof request.headers['x-arr-ssl'] === 'string';
  }

  // Check for forwarded protocol header.
  // This is typical for AWS.
  return request.headers['x-forwarded-proto'] === 'https';
}
