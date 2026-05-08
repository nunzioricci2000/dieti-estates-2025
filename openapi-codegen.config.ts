import {
  generateSchemaTypes,
  generateReactQueryComponents,
} from "@openapi-codegen/typescript";
import { defineConfig } from "@openapi-codegen/cli";
import type { Context } from "@openapi-codegen/typescript/lib/generators/types.js";

export default defineConfig({
  api: {
    from: {
      relativePath: "./backend/openapi.yaml",
      source: "file",
    },
    outputDir: "./frontend/api",
    to: async (context: Context) => {
      const filenamePrefix = "api";
      const { schemasFiles } = await generateSchemaTypes(context, {
        filenamePrefix,
      });
      await generateReactQueryComponents(context, {
        filenamePrefix,
        schemasFiles,
      });
    },
  },
});
