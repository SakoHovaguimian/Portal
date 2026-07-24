import { defineConfig, globalIgnores } from "eslint/config";
import nextVitals from "eslint-config-next/core-web-vitals";
import nextTs from "eslint-config-next/typescript";
import { noRawUserFacingStrings } from "./eslint-rules/no-raw-user-facing-strings.mjs";

const eslintConfig = defineConfig([
  ...nextVitals,
  ...nextTs,
  // Override default ignores of eslint-config-next.
  globalIgnores([
    // Default ignores of eslint-config-next:
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
    "src/theme/generated/**",
  ]),
  {
    files: ["src/**/*.tsx"],
    ignores: ["src/content/**"],
    plugins: {
      portal: {
        rules: {
          "no-raw-user-facing-strings": noRawUserFacingStrings,
        },
      },
    },
    rules: {
      "portal/no-raw-user-facing-strings": "error",
    },
  },
]);

export default eslintConfig;
