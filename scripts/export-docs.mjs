import { rmSync, cpSync, writeFileSync, existsSync } from "node:fs";
if (!existsSync("out")) throw new Error("out/ not found - run next build first");
rmSync("docs", { recursive: true, force: true });
cpSync("out", "docs", { recursive: true });
writeFileSync("docs/.nojekyll", "");
console.log("Static site copied to docs/");
