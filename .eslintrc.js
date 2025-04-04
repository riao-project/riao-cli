module.exports = {
	root: true,
	parser: "@typescript-eslint/parser",
	plugins: [
		"@typescript-eslint"
	],
	extends: [
		"eslint:recommended",
		"plugin:@typescript-eslint/recommended"
	],
	parserOptions: {
		project: "./tsconfig.json",
		tsconfigRootDir: __dirname,
	},
	rules: {
		"brace-style": 0,
		"curly": 2,
		"indent": [2, "tab"],
		"max-len": [1, 80],
		"no-case-declarations": 1,
		"no-console": 1,
		"no-debugger": 1,
		"no-empty": 1,
		"no-eval": 2,
		"no-trailing-spaces": 1,
		"no-irregular-whitespace": 1,
		"no-mixed-spaces-and-tabs": 1,
		"no-prototype-builtins": 1,
		"no-use-before-define": 1,
		"no-useless-escape": 1,
		"no-var": 2,
		"prefer-const": 1,
		"quotes": [1, "single"],
		"radix": 1,
		"semi": [1, "always"],
		"@typescript-eslint/ban-types": 1,
		"@typescript-eslint/brace-style": [2, "stroustrup"],
		"@typescript-eslint/no-empty-function": 0,
		"@typescript-eslint/no-empty-interface": 1,
		"@typescript-eslint/no-explicit-any": 1,
		"@typescript-eslint/no-floating-promises": 2,
		"@typescript-eslint/no-misused-new": 2,
		"@typescript-eslint/no-namespace": 1,
		"@typescript-eslint/no-unused-vars": 1,
		"@typescript-eslint/promise-function-async": 1,
		"@typescript-eslint/no-var-requires": 2,
	},
};
