import {eslintConfig} from '@rinkkasatiainen/eslint-config.js'

export default [
  {
    ...eslintConfig,
    languageOptions: {
      ...eslintConfig.languageOptions,
      globals: {
        ...eslintConfig.languageOptions.globals,
        mocha: true,
      }
    }
  },
  {
    rules:
      {
<<<<<<< HEAD:finding-seams/javascript/eslint.config.mjs
=======
        'no-unused-vars': ["error", { "argsIgnorePattern": "^_", "varsIgnorePattern": "^_"}],
>>>>>>> cohort/main:02-finding-seams/javascript/eslint.config.mjs
        'mocha/consistent-spacing-between-blocks': 'off',
        'mocha/no-pending-tests': 'off',
        'max-classes-per-file': 'off'
      }
  }
]

