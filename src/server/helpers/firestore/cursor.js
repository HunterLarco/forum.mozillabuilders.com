import { documentToJson } from '@/src/server/helpers/firestore/json';

export function compose(inclusive, ...args) {
  const buffer = Buffer.from(JSON.stringify([inclusive, ...args]));
  return buffer.toString('base64');
}

export function decompose(cursor) {
  const buffer = Buffer.from(cursor, 'base64');
  return JSON.parse(buffer.toString(), jsonReviver);
}

export function applyCursor(query, cursor) {
  if (!cursor) {
    return query;
  }

  const [inclusive, ...cursorParts] = decompose(cursor);
  return inclusive
    ? query.startAt(...cursorParts)
    : query.startAfter(...cursorParts);
}

export async function executeQuery({ query, cursor, createCursor }) {
  const snapshot = await applyCursor(query, cursor).get();

  if (snapshot.empty) {
    return {
      documents: [],
      cursor: {
        current: null,
        next: null,
      },
    };
  }

  const results = snapshot.docs.map((document) => {
    const json = documentToJson(document);
    const cursor = createCursor(json);
    return {
      id: document.id,
      document: json,
      cursor: {
        current: compose(true, ...cursor),
        next: compose(false, ...cursor),
      },
    };
  });

  return {
    documents: results,
    cursor: {
      current: results[0].cursor.current,
      next: results[results.length - 1].cursor.next,
    },
  };
}

function jsonReviver(key, value) {
  const dateFormat = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}(\.\d+)?Z$/;
  return typeof value === 'string' && dateFormat.test(value)
    ? new Date(value)
    : value;
}
