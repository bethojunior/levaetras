import { cpSync, existsSync } from "node:fs";
import { resolve } from "node:path";
import { pathToFileURL } from "node:url";
const server = resolve(".next/standalone/server.js");
if (!existsSync(server))
  throw new Error("Execute npm run build antes de iniciar o servidor.");
const args = process.argv.slice(2);
const portIndex = args.indexOf("--port");
const port = portIndex >= 0 ? args[portIndex + 1] : process.env.PORT || "3000";
if (!port || !/^\d+$/.test(port) || Number(port) < 1 || Number(port) > 65535)
  throw new Error("Porta inválida.");
process.env.PORT = port;
process.env.HOSTNAME = "0.0.0.0";
// Standalone changes the working directory; keep local data in the project.
process.env.DATABASE_PATH = resolve(
  process.env.DATABASE_PATH || "data/paritins.sqlite",
);
cpSync("public", ".next/standalone/public", { recursive: true });
cpSync(".next/static", ".next/standalone/.next/static", { recursive: true });
await import(pathToFileURL(server).href);
