import globals from "globals";
import pluginJs from "@eslint/js";
import jestPlugin from "eslint-plugin-jest"; // Tambahkan plugin Jest

/** @type {import('eslint').Linter.Config[]} */
export default [
  // Konfigurasi untuk file JavaScript umum
  {
    files: ["**/*.js"],
    languageOptions: {
      sourceType: "commonjs",
      globals: globals.node, // Tambahkan global untuk Node.js
    },
  },

  // Tambahkan konfigurasi Jest untuk file pengujian
  {
    files: ["**/*.test.js", "**/__tests__/**/*.js"],
    languageOptions: {
      globals: {
        ...globals.jest, // Tambahkan global untuk Jest
      },
    },
    plugins: {
      jest: jestPlugin, // Daftarkan plugin Jest
    },
    rules: {
      ...jestPlugin.configs.recommended.rules, // Gunakan aturan rekomendasi Jest
    },
  },

  // Konfigurasi rekomendasi dari plugin-js
  pluginJs.configs.recommended,
];
