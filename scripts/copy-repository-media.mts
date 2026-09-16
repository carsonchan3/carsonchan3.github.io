import { cp, mkdir } from "node:fs/promises";
import path from "node:path";
import { fileURLToPath } from "node:url";

const projectRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const source = path.join(projectRoot, "media");
const target = path.join(projectRoot, "dist", "public", "media");
await mkdir(path.dirname(target), { recursive: true });
await cp(source, target, { recursive: true });
console.log(`Copied GitHub-hosted media to ${path.relative(projectRoot, target)}.`);
