import assert from "node:assert/strict";
import { test } from "node:test";
import { build } from "esbuild";
import { mkdtemp, readFile, rm } from "node:fs/promises";
import os from "node:os";
import path from "node:path";
import { pathToFileURL, fileURLToPath } from "node:url";
import { createServer } from "node:http";
import { once } from "node:events";

const here = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(here, "../..");
const temporary = await mkdtemp(path.join(os.tmpdir(), "licence-deployment-test-"));
const authPath = path.join(temporary, "auth.mjs");
await build({
  entryPoints: [path.join(here, "src/lib/admin-auth.ts")],
  outfile: authPath,
  bundle: true,
  platform: "node",
  format: "esm",
  logLevel: "silent",
});
const { createAdminToken, verifyAdminToken, sameValue } = await import(pathToFileURL(authPath).href);
const config = { username: "test-operator", password: "test-only-password", secret: "test-signing-secret-never-use-in-production" };

await test("admin tokens reject tampering, expiry, and changed credentials", () => {
  const now = 1_000_000;
  const token = createAdminToken(config, now);
  assert.equal(verifyAdminToken(token, config, now), true);
  assert.equal(verifyAdminToken(token, config, now + 60 * 60 * 1000), false);
  assert.equal(verifyAdminToken(`${token}x`, config, now), false);
  assert.equal(verifyAdminToken("legacy-base64-token", config, now), false);
  assert.equal(verifyAdminToken(token, { ...config, password: "changed" }, now), false);
  assert.equal(sameValue("same", "same"), true);
  assert.equal(sameValue("same", "different"), false);
});

await test("Vercel output separates API, static files, and SPA fallback", async () => {
  const output = path.join(root, ".vercel/output");
  const routing = JSON.parse(await readFile(path.join(output, "config.json"), "utf8"));
  const functionConfig = JSON.parse(await readFile(path.join(output, "functions/backend.func/.vc-config.json"), "utf8"));
  assert.equal(routing.version, 3);
  assert.equal(functionConfig.runtime, "nodejs22.x");
  assert.equal(functionConfig.handler, "index.mjs");
  assert.ok(new RegExp(routing.routes[0].src).test("/api/healthz"));
  assert.ok(new RegExp(routing.routes[0].src).test("/api"));
  assert.equal(new RegExp(routing.routes[0].src).test("/apiculture"), false);
  assert.equal(routing.routes[1].handle, "filesystem");
  assert.equal(routing.routes.at(-1).dest, "/index.html");
  assert.match(await readFile(path.join(output, "static/index.html"), "utf8"), /Independent Service/);
});

await test("built function serves health and denies anonymous admin reads and writes", async () => {
  const { default: handler } = await import(pathToFileURL(path.join(root, ".vercel/output/functions/backend.func/index.mjs")).href);
  const server = createServer(handler);
  server.listen(0, "127.0.0.1");
  await once(server, "listening");
  const base = `http://127.0.0.1:${server.address().port}/backend`;
  try {
    const health = await fetch(`${base}?__api_path=healthz`);
    assert.equal(health.status, 200);
    assert.equal((await health.json()).status, "ok");
    for (const method of ["GET", "POST", "PATCH", "DELETE"]) {
      const response = await fetch(`${base}?__api_path=admin/applications/0`, { method });
      assert.ok([401, 503].includes(response.status), `${method}: ${response.status}`);
      assert.equal(response.headers.get("cache-control"), "no-store");
      assert.equal(typeof (await response.json()).error, "string");
    }
    const forged = await fetch(`${base}?__api_path=admin/stats`, { headers: { authorization: "Bearer forged-token" } });
    assert.ok([401, 503].includes(forged.status));
  } finally {
    server.closeAllConnections();
    await new Promise(resolve => server.close(resolve));
  }
});
await rm(temporary, { recursive: true, force: true });
