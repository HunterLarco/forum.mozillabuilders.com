export default function assertCronJob(headers) {
  if (headers['x-appengine-cron'] != 'true') {
    throw {
      httpErrorCode: 401,
      name: 'Unauthorized',
      message: 'Request must include cron job header',
    };
  }
}
