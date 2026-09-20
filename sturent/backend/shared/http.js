const ALLOW_ORIGIN = process.env.CORS_ORIGIN || "*";

export function json(statusCode, body) {
  return {
    statusCode,
    headers: {
      "Content-Type": "application/json",
      "Access-Control-Allow-Origin": ALLOW_ORIGIN,
      "Access-Control-Allow-Headers": "Content-Type",
      "Access-Control-Allow-Methods": "GET,POST,OPTIONS"
    },
    body: JSON.stringify(body)
  };
}

export function error(statusCode, error, message) {
  console.error(error, message);
  return json(statusCode, { error, message });
}

export function parseBody(event) {
  if (!event?.body) return {};
  const raw = event.isBase64Encoded
    ? Buffer.from(event.body, "base64").toString("utf8")
    : event.body;
  try {
    return JSON.parse(raw);
  } catch {
    return null;
  }
}

export function pathParam(event, name) {
  return event?.pathParameters?.[name] || event?.pathParameters?.[name.replace("Id", "id")];
}
