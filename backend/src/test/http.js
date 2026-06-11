import request from "supertest";

/**
 * Sends a JSON body with an exact `application/json` content-type. The current
 * backend reads the body as text and only JSON-parses it when the header is
 * EXACTLY "application/json" (no charset suffix), so we set it explicitly here
 * rather than relying on superagent's default serialization.
 *
 * @param {import("express").Express} app
 * @param {string} url
 * @param {unknown} body
 * @param {Record<string, string>} [headers]
 */
export function postJson(app, url, body, headers = {}) {
	const req = request(app).post(url).set("Content-Type", "application/json");
	for (const [key, value] of Object.entries(headers)) {
		req.set(key, value);
	}
	return req.send(JSON.stringify(body));
}
