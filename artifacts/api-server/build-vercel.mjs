import { build } from "esbuild";
import { cp, mkdir, rm, writeFile } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const dir = path.dirname(fileURLToPath(import.meta.url));
const root = path.resolve(dir, "../..");
const output = path.join(root, ".vercel/output");
const func = path.join(output, "functions/backend.func");

// Use Vercel's Build Output API to deploy this monorepo as one site.
// No Replit proxy, PORT, or database connection is needed during compilation.
await rm(output, { recursive: true, force: true });
await mkdir(func, { recursive: true });
await cp(
  path.join(root, "artifacts/uk-licence/dist/public"),
  path.join(output, "static"),
  { recursive: true },
);
await build({
  entryPoints: [path.join(dir, "src/vercel.ts")],
  outfile: path.join(func, "index.mjs"),
  bundle: true,
  platform: "node",
  target: "node22",
  format: "esm",
  external: ["pg-native"],
  define: { "process.env.NODE_ENV": '"production"' },
  banner: {
    js: "import { createRequire } from 'node:module'; const require = createRequire(import.meta.url);",
  },
  logLevel: "info",
});
await writeFile(path.join(func, ".vc-config.json"), JSON.stringify({
  runtime: "nodejs22.x",
  handler: "index.mjs",
  launcherType: "Nodejs",
  maxDuration: 30,
  supportsResponseStreaming: true,
}, null, 2));
await writeFile(path.join(output, "config.json"), JSON.stringify({
  version: 3,
  routes: [
    { src: "^/api(?:/(.*))?$", dest: "/backend?__api_path=$1" },
    { handle: "filesystem" },
    { src: "^/(?:assets|img)/.*$", status: 404 },
    { src: "^/(.*)$", dest: "/index.html" },
  ],
}, null, 2));
