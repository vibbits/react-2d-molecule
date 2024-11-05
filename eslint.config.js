import eslint from "@eslint/js";
import prettier_config from "eslint-config-prettier";
import tseslint from "typescript-eslint";
import react from "eslint-plugin-react";
import globals from "globals";

export default tseslint.config(
	eslint.configs.recommended,
	...tseslint.configs.recommended,
	prettier_config,
	{
		files: ["**/*.{ts,tsx}"],
		plugins: { react },
		languageOptions: {
			ecmaVersion: "latest",
			globals: {
				...globals.browser
			},
		},
		rules: {
			"@typescript-eslint/no-unused-vars": [
				"error",
				{
					argsIgnorePattern: "^_",
				}
			]
		}
	}
);
