import $RefParser from "@apidevtools/json-schema-ref-parser";
import fs from "node:fs/promises";
import path from "node:path";

const inputs = [
  "schema/events/v1/stored-event.schema.json",
  "schema/events/v1/canonical-event.schema.json",
  "schema/events/v1/record-data.schema.json"
];

const outDir = "schemas/bundles/generated";

function stripIds(obj) {
  if (!obj || typeof obj !== "object") return;
  if (Object.prototype.hasOwnProperty.call(obj, "$id")) delete obj.$id;
  for (const v of Object.values(obj)) stripIds(v);
}

await fs.mkdir(outDir, { recursive: true });

for (const input of inputs) {
  const base = path.basename(input).replace(".schema.json", ".bundled.schema.json");
  const output = path.join(outDir, base);

  const bundled = await $RefParser.bundle(input, {
    dereference: { circular: "ignore" }
  });
  
  stripIds(bundled);

  await fs.writeFile(output, JSON.stringify(bundled, null, 2), "utf8");
  console.log(`Bundled ${input} -> ${output}`);
}
