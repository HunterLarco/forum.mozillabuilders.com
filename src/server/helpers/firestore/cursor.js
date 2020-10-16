export function compose(...args) {
  const buffer = Buffer.from(JSON.stringify(args));
  return buffer.toString('base64');
}

export function decompose(cursor) {
  const buffer = Buffer.from(cursor, 'base64');
  return JSON.parse(buffer.toString());
}
