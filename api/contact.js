const json = (res, status, body) => {
  res.status(status).setHeader("Content-Type", "application/json");
  res.send(JSON.stringify(body));
};

const getEnvString = (value) => (typeof value === "string" ? value.trim() : "");

const getConfig = () => {
  const accessKey = getEnvString(process.env.WEB3FORMS_KEY);
  const endpoint = getEnvString(process.env.WEB3FORMS_MAIL_API);

  if (accessKey === "" || endpoint === "") {
    return null;
  }

  return {
    accessKey,
    endpoint,
  };
};

const isValidPayload = (body) => {
  if (typeof body !== "object" || body === null) {
    return false;
  }

  const payload = body;

  return (
    typeof payload.name === "string" &&
    typeof payload.email === "string" &&
    typeof payload.subject === "string" &&
    typeof payload.message === "string" &&
    typeof payload.botcheck === "string"
  );
};

const handler = async (req, res) => {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return json(res, 405, { success: false });
  }

  const config = getConfig();

  if (!config) {
    return json(res, 500, { success: false });
  }

  if (!isValidPayload(req.body)) {
    return json(res, 400, { success: false });
  }

  if (req.body.botcheck) {
    return json(res, 200, { success: true });
  }

  try {
    const body = new FormData();
    body.append("access_key", config.accessKey);
    body.append("name", req.body.name.trim());
    body.append("email", req.body.email.trim());
    body.append("subject", req.body.subject.trim());
    body.append("message", req.body.message.trim());
    body.append("botcheck", "");

    const upstream = await fetch(config.endpoint, {
      method: "POST",
      body,
    });

    const contentType = upstream.headers.get("content-type");

    if (!upstream.ok || !contentType?.includes("application/json")) {
      return json(res, 502, { success: false });
    }

    const data = await upstream.json();

    if (data?.success !== true) {
      return json(res, 502, { success: false });
    }

    return json(res, 200, { success: true });
  } catch {
    return json(res, 502, { success: false });
  }
};

export default handler;
