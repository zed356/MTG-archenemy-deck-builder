// eslint.config.js
import { defineConfig } from "eslint-define-config";

export default defineConfig([
  {
    languageOptions: {
      globals: {
        window: true,
        document: true,
      },
      parserOptions: {
        ecmaVersion: "latest",
        sourceType: "module",
      },
    },
  },
  {
    plugins: {
      import: {},
    },
  },
  {
    rules: {
      "no-unused-vars": ["warn", { argsIgnorePattern: "^_" }],
      // You can add rules from eslint-plugin-import that you want to enforce
      "import/default": "error",
      "import/export": "error",
      "import/no-unused-modules": [1, { unusedExports: true }],
    },
  },
]);
