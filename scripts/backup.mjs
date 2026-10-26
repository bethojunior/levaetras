import { backup } from "node:sqlite";
import { mkdirSync } from "node:fs";
import { dirname, resolve } from "node:path";
import { getDatabase } from "../lib/database.mjs";
const destination = resolve(
  process.argv[2] ||
    `backups/paritins-${new Date().toISOString().replaceAll(":", "-")}.sqlite`,
);
if (
  destination === resolve(process.env.DATABASE_PATH || "./data/paritins.sqlite")
)
  throw new Error("O destino precisa ser diferente do banco ativo.");
mkdirSync(dirname(destination), { recursive: true, mode: 0o700 });
await backup(getDatabase(), destination);
console.log(`Backup concluído: ${destination}`);
getDatabase().close();
