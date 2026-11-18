import assert from "node:assert/strict";
import { createServer } from "node:http";
import { once } from "node:events";
import { cp, mkdtemp, readFile, rm, stat } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { fileURLToPath, pathToFileURL } from "node:url";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "../..");
const output = path.join(root, ".vercel/output");
const config = JSON.parse(await readFile(path.join(output, "config.json"), "utf8"));
const functionDir = path.join(output, "functions/backend.func");
const functionConfig = JSON.parse(await readFile(path.join(functionDir, ".vc-config.json"), "utf8"));
assert.equal(config.version, 3);
assert.equal(functionConfig.runtime, "nodejs22.x");
assert.equal(functionConfig.handler, "index.mjs");
assert.equal(functionConfig.launcherType, "Nodejs");

const html = await readFile(path.join(output, "static/index.html"), "utf8");
assert.match(html, /<div id="root"><\/div>/);
for (const [, asset] of html.matchAll(/(?:src|href)="(\/assets\/[^"]+)"/g)) {
  assert.ok((await stat(path.join(output, "static", asset))).isFile(), asset);
}
const apiRule = config.routes[0];
const apiPattern = new RegExp(apiRule.src);
assert.ok(apiPattern.test("/api"));
assert.ok(apiPattern.test("/api/healthz"));
assert.ok(!apiPattern.test("/api-other"));
assert.equal(config.routes[1].handle, "filesystem");
const missingAssetRule = config.routes[2];
assert.equal(missingAssetRule.status, 404);
assert.ok(new RegExp(missingAssetRule.src).test("/assets/missing.js"));
const spaRule = config.routes.at(-1);
for (const route of ["/", "/admin", "/admin/applications/123", "/track", "/how-to-apply"]) {
  assert.ok(new RegExp(spaRule.src).test(route));
  assert.equal(spaRule.dest, "/index.html");
}

// Import the packaged API outside the workspace so missing runtime dependencies
// cannot be accidentally resolved from this repository's node_modules.
const isolatedDir = await mkdtemp(path.join(os.tmpdir(), "vercel-api-check-"));
let server;
try {
  await cp(functionDir, isolatedDir, { recursive: true });
  // Never use the project's database or real administrator credentials in tests.
  process.env.DATABASE_URL = "postgresql://test:test@127.0.0.1:1/test";
  process.env.NODE_ENV = "production";
  const { default: handler } = await import(pathToFileURL(path.join(isolatedDir, "index.mjs")).href);
  server = createServer(handler);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const origin = `http://127.0.0.1:${server.address().port}`;

  async function check(urlPath, expectedStatus, options = {}) {
    const original = new URL(urlPath, origin);
    const match = original.pathname.match(apiPattern);
    assert.ok(match, "Test request must match the generated API rewrite");
    const rewritten = new URL(apiRule.dest.replace("$1", match[1] ?? ""), origin);
    for (const [key, value] of original.searchParams) {
      rewritten.searchParams.append(key, value);
    }
    const response = await fetch(rewritten, options);
    assert.equal(response.status, expectedStatus, `${options.method ?? "GET"} ${urlPath}`);
    return response;
  }

  assert.deepEqual(await (await check("/api/healthz?source=packaged-test", 200)).json(), { status: "ok" });
  await check("/api/no-such-route", 404);
  await check("/api/applications/track", 400);
  await check("/api/applications/track?code=", 400);
  await check("/api/admin/applications/not-an-id", 400);
  await check("/api/admin/applications/not-an-id", 400, { method: "DELETE" });
  await check("/api/admin/applications/not-an-id", 400, {
    method: "PATCH", headers: { "content-type": "application/json" }, body: "{}",
  });
  await check("/api/admin/applications", 400, {
    method: "POST", headers: { "content-type": "application/json" }, body: "{}",
  });
  await check("/api/admin/login", 400, {
    method: "POST", headers: { "content-type": "application/json" }, body: "{}",
  });
  console.info("PASS: Vercel output, SPA/static routes, isolated API import, health and validation routes. No database records accessed.");
} finally {
  if (server) {
    server.closeAllConnections();
    await new Promise((resolve) => server.close(resolve));
  }
  await rm(isolatedDir, { recursive: true, force: true });
}
