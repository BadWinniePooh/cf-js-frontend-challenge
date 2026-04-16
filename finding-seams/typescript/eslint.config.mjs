<<<<<<< HEAD:finding-seams/typescript/eslint.config.mjs
import {eslintConfig} from '@rinkkasatiainen/eslint-config.ts'

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
        'mocha/consistent-spacing-between-blocks': 'off',
        'mocha/no-pending-tests': 'off',
        'max-classes-per-file': 'off'
      }
  }
]

=======
import eslint from '@eslint/js'
import tseslint from 'typescript-eslint'

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  { ignores: ['dist/**', 'node_modules/**'] },
)
>>>>>>> cohort/main:02-finding-seams/typescript/eslint.config.mjs
