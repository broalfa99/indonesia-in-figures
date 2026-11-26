// Indonesia in Figures — the hand-in program (Node 22, standard library only).
//
// The site lives in app/ beside this file: plain static files, no build step,
// no network request. This program copies app/ and screenshots/ into the
// grader's output directory and writes dossier.json there, using the kit's
// vendored library — the library must stay exactly as the kit shipped it, so
// the scorer can rebuild the same dossier byte for byte.
//
// Outside the grader, MAKEFUN_OUTPUT_DIR stands in for /output:
//   mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts

import { cpSync, existsSync, mkdirSync, writeFileSync } from "node:fs";
import { join } from "node:path";
import { fileURLToPath } from "node:url";
import { buildDossier } from "./vendor/makefun-frontend.ts";

const here = fileURLToPath(new URL(".", import.meta.url));
const out = process.env.MAKEFUN_OUTPUT_DIR ?? "/output";

mkdirSync(out, { recursive: true });
cpSync(join(here, "app"), join(out, "app"), { recursive: true });
mkdirSync(join(out, "screenshots"), { recursive: true });
if (existsSync(join(here, "screenshots"))) {
  cpSync(join(here, "screenshots"), join(out, "screenshots"), { recursive: true });
}

// The caps below mirror the gate: at most 4 screenshots of 256 KiB each, an
// app/ of at most 993 files and 16 MiB, and a dossier text of at most 160 KiB.
writeFileSync(
  join(out, "dossier.json"),
  buildDossier(out, {
    text_max_bytes: 163840,
    screenshots: { max: 4, max_bytes: 262144 },
    app_max_files: 993,
    app_max_bytes: 16777216,
  }),
);
