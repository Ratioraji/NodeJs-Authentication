/**
 * ! ECMAScript version should correspond to Node.js version,
 * ! because even if linter accepts code, runtime won't execute it.
 *
 * ! Run `npm run lint:config` to see global config file.
 */

module.exports = {
	/** This is the parent configuration */
    root: true,
    /** Each environment brings a set of predefined global VARIABLES */
    env: {
        es2020: true,
        node: true,
    },
    /**
     * Plugins EXPORT configuration files with rules.
     * ! Not all installed packages are mentioned here, every package has its own installation flow.
     */
    plugins: [
		'@typescript-eslint',
		'security'
    ],
    /** Configurations and rules to extend this file */
    extends: [
		'eslint:recommended',						/** https://eslint.org/docs/rules/ */
		'airbnb-typescript/base',					/** https://github.com/airbnb/javascript */
		'plugin:security/recommended',				/** https://www.npmjs.com/package/eslint-plugin-security#rules */
		'plugin:@typescript-eslint/recommended',	/** https://github.com/typescript-eslint/typescript-eslint/tree/master/packages/eslint-plugin#supported-rules */
	],
    overrides: [
        {
          files: ['*.ts', '*.tsx'], // Your TypeScript files extension
          parserOptions: {
                ecmaVersion: 2020,         						/** The version of ECMAScript SYNTAX to support */
                project: './tsconfig.json',						/** Required by parser to find TS configuration */
                tsconfigRootDir: __dirname,
                ecmaFeatures: {
                    impliedStrict: true							/** Enables `strict mode`  */
                }
            }
        }
      ],
    parser: '@typescript-eslint/parser',				/** This allows ESLint to understand TypeScript syntax */
	/** 0 = off, 1 = warn, 2 = error */
    rules: {

		/** TypeScript */
        '@typescript-eslint/indent': [
            'error',
            4
        ],
        '@typescript-eslint/semi': [
            'error',
            'always'
        ],
        '@typescript-eslint/no-throw-literal': 0,
        '@typescript-eslint/camelcase': 'warn',
        '@typescript-eslint/no-use-before-define': 'warn',
        '@typescript-eslint/require-await': 'warn',
        '@typescript-eslint/interface-name-prefix': 0,
        '@typescript-eslint/camelcase': 0,

		/** Import */
        'import/no-dynamic-require': 0,
		'import/prefer-default-export': 0,
		'import/extensions': 0,
		'import/order': 0,
        'import/no-extraneous-dependencies': 0,

        /** ESLint */
        'linebreak-style': 0,
		'radix': 'warn',
        'no-await-in-loop': 'warn',
        'consistent-return': 'warn',
        'no-useless-catch': 'warn',
        'max-len': 0,
        'class-methods-use-this': 0,
        'no-underscore-dangle': 0,
        'max-classes-per-file': 0,
        'no-tabs': 0,
        'global-require': 0,
		'no-mixed-operators': 0,
		'arrow-parens': 0,
        "useUnknownInCatchVariables": 0,
    },
};
