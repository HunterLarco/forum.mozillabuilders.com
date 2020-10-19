import wildcardMatch from 'wildcard-match';

export default function middleware(options) {
  const include = options && options.include ? options.include : ['**'];
  const exclude = options && options.exclude ? options.exclude : [];

  return (request, response, next) => {
    if (request.hostname == 'localhost' && process.fido.env == 'local') {
      return next();
    }

    for (const pattern of include) {
      if (!wildcardMatch(pattern, '/').test(request.path.slice(1))) {
        return next();
      }
    }

    for (const pattern of exclude) {
      if (wildcardMatch(pattern, '/').test(request.path.slice(1))) {
        return next();
      }
    }

    if (isAppengineRequest(request)) {
      return next();
    }

    response
      .status(401)
      .send('Unauthorized: unable to verify appengine headers');
  };
}

function isAppengineRequest(request) {
  return request.headers['x-appengine-cron'] == 'true';
}
