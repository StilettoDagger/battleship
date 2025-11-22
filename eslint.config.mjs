import js from "@eslint/js";
import globals from "globals";
import json from "@eslint/json";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig([
	{
		files: ["src/**/*.{js,mjs,cjs}"],
		extends: [js.configs.recommended],
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			globals: { ...globals.browser },
		},
		ignores: ["dist/**"],
	},
	{
		files: ["**/*test.js"],
		languageOptions: {
			globals: {
				...globals.jest,
			},
		},
		rules: {
			"no-unused-vars": "warn",
			"no-undef": "warn",
		},
	},
	{
		files: ["**/*.json"],
		plugins: { json },
		language: "json/json",
		extends: [js.configs.recommended],
	},
	{
		files: [
			"*.config.{js,cjs}",
			"webpack*.{js,cjs}",
			"scripts/**/*.{js,cjs}",
			"*.cjs",
			"*.js",
		],
		extends: [js.configs.recommended],
		ignores: ["src/**/*"],
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "commonjs",
			globals: {
				...globals.node,
			},
		},
	},
	eslintConfigPrettier,
]);
