import js from "@eslint/js";
import globals from "globals";
import json from "@eslint/json";
import { defineConfig } from "eslint/config";
import eslintConfigPrettier from "eslint-config-prettier";

export default defineConfig([
	{
		files: ["src/**/*.{js,mjs,cjs}"],
		plugins: { js },
		extends: ["js/recommended"],
		languageOptions: {
			ecmaVersion: "latest",
			sourceType: "module",
			globals: {...globals.browser},
		},
		ignores: ["dist/**"]
	},
	{
		files: ["**/*.json"],
		plugins: { json },
		language: "json/json",
		extends: ["json/recommended"],
	},
	{
		files: [
			"*.config.{js,cjs,mjs}",
			"webpack*.{js,cjs,mjs}",
			"scripts/**/*.{js,cjs,mjs}",
			"*.cjs",
			"*.mjs",
			"*.js",
		],
		extends:["js/recommended"],
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