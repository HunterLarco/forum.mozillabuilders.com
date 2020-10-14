export default async function apiFetch(path, body) {
  return await fetch(`${process.fido.flags.apiServer}/${path}`, {
    method: 'POST',
    body: JSON.stringify(body || {}),
    headers: {
      'Content-Type': 'application/json',
    },
  }).then(async (response) => {
    let json;
    try {
      json = await response.json();
    } catch {
      return Promise.reject({
        name: 'BadResponse',
        message: 'Invalid JSON from server',
      });
    }

    if (response.status != 200) {
      return Promise.reject(json);
    }

    return json;
  });
}
