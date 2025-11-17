import pkg from "@prisma/generator-helper";
import { writeFileSync } from "node:fs";
import { resolve } from "node:path";

const { generatorHandler } = pkg;

generatorHandler({
  onManifest() {
    return {
      defaultOutput: "../generated/enums.ts",
      prettyName: "Prisma Enums Generator",
    };
  },
  async onGenerate(options) {
    // Build JS content
    let content = "// THIS FILE IS AUTO-GENERATED FROM PRISMA ENUMS\n\n";

    options.dmmf.datamodel.enums.forEach((enm) => {
      const name = enm.name;
      const values = enm.values.map((v) => `"${v.name}"`).join(", ");
      content += `export const ${name}EnumArray = [${values}] as const;\n\n`;
    });

    writeFileSync(resolve("generated", "enums.ts"), content, "utf-8");
  },
});
