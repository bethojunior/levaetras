import { test } from "node:test";
import assert from "node:assert/strict";
import {
  mkdtempSync,
  realpathSync,
  mkdirSync,
  copyFileSync,
  writeFileSync,
  readFileSync,
  existsSync,
  rmSync,
} from "node:fs";
import { tmpdir } from "node:os";
import { join, resolve } from "node:path";
import { spawnSync } from "node:child_process";
const nextImage = `ghcr.io/madgic-inc/paritins@sha256:${"a".repeat(64)}`;
const oldImage = `ghcr.io/madgic-inc/paritins@sha256:${"b".repeat(64)}`;
function fixture(t) {
  const dir = realpathSync(mkdtempSync(join(tmpdir(), "paritins-deploy-")));
  t.after(() => rmSync(dir, { recursive: true, force: true }));
  const repo = join(dir, "checkout"),
    target = join(dir, "paritins"),
    bin = join(dir, "bin"),
    log = join(dir, "calls.log");
  for (const folder of [join(repo, "scripts"), target, bin])
    mkdirSync(folder, { recursive: true });
  for (const file of [
    "compose.yaml",
    "scripts/deploy-local.sh",
    "scripts/deploy.sh",
  ])
    copyFileSync(resolve(file), join(repo, file));
  writeFileSync(join(target, ".env"), "PORT=3335\nCOOKIE_SECURE=true\n");
  writeFileSync(
    join(bin, "docker"),
    `#!${process.execPath}\nconst fs=require('node:fs');const args=process.argv.slice(2);fs.appendFileSync(process.env.MOCK_LOG,JSON.stringify({args,image:process.env.PARITINS_IMAGE,cwd:process.cwd()})+'\\n');if(args.includes('test'))process.exit(process.env.MOCK_EXISTING==='1'?0:1);if(args[1]==='up'&&process.env.MOCK_FAIL==='1'&&process.env.PARITINS_IMAGE===process.env.MOCK_NEW)process.exit(1);`,
    { mode: 0o755 },
  );
  const run = (image = nextImage, path = target, extra = {}) =>
    spawnSync("bash", [join(repo, "scripts/deploy-local.sh"), image, path], {
      encoding: "utf8",
      env: {
        ...process.env,
        PATH: `${bin}:${process.env.PATH}`,
        MOCK_LOG: log,
        MOCK_NEW: nextImage,
        RUNNER_WORKSPACE: repo,
        ...extra,
      },
    });
  return {
    repo,
    target,
    log,
    run,
    calls: () =>
      existsSync(log)
        ? readFileSync(log, "utf8").trim().split("\n").map(JSON.parse)
        : [],
  };
}
test("deploy uses stable directory and preserves environment and data", (t) => {
  const f = fixture(t);
  writeFileSync(join(f.target, "data-marker"), "keep");
  const result = f.run();
  assert.equal(result.status, 0, result.stderr);
  assert.equal(
    readFileSync(join(f.target, ".env"), "utf8"),
    "PORT=3335\nCOOKIE_SECURE=true\n",
  );
  assert.equal(readFileSync(join(f.target, "data-marker"), "utf8"), "keep");
  assert.equal(
    readFileSync(join(f.target, ".deployed-image"), "utf8").trim(),
    nextImage,
  );
  assert.ok(f.calls().every((c) => c.cwd === f.target));
  assert.ok(f.calls().some((c) => c.args.includes("--no-build")));
});
test("failed deployment backs up first and restores previous image", (t) => {
  const f = fixture(t);
  writeFileSync(join(f.target, ".deployed-image"), oldImage + "\n");
  const result = f.run(nextImage, f.target, {
    MOCK_FAIL: "1",
    MOCK_EXISTING: "1",
  });
  assert.notEqual(result.status, 0);
  const calls = f.calls();
  const backup = calls.findIndex((c) => c.args.includes("scripts/backup.mjs"));
  const firstUp = calls.findIndex((c) => c.args[1] === "up");
  assert.ok(backup >= 0 && backup < firstUp);
  assert.deepEqual(
    calls.filter((c) => c.args[1] === "up").map((c) => c.image),
    [nextImage, oldImage],
  );
  assert.equal(
    readFileSync(join(f.target, ".deployed-image"), "utf8").trim(),
    oldImage,
  );
});
test("rejects mutable image tags, missing environment and checkout deployment", (t) => {
  const f = fixture(t);
  assert.notEqual(f.run("ghcr.io/madgic-inc/paritins:latest").status, 0);
  assert.notEqual(f.run(nextImage, join(f.repo, "production")).status, 0);
  rmSync(join(f.target, ".env"));
  assert.notEqual(f.run().status, 0);
  assert.deepEqual(f.calls(), []);
});
