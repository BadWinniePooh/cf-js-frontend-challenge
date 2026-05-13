import prettierPlugin from 'eslint-plugin-prettier'
import mochaPlugin from 'eslint-plugin-mocha'
import stylisticJs from '@stylistic/eslint-plugin'
import eslintConfigPrettier from 'eslint-config-prettier'
import importPlugin from 'eslint-plugin-import'

const prettierOverwrites = {
  semi: false,
  singleQuote: true,
  trailingComma: 'all',
  arrowParens: 'always',
}

export default [
  {
    plugins: {
      prettier: prettierPlugin,
      '@stylistic': stylisticJs,
      mocha: mochaPlugin,
      import: importPlugin,
    },

    rules: {
      'mocha/no-mocha-arrows': 'off',
      'mocha/no-setup-in-describe': 'off',
      'prettier/prettier': ['error', prettierOverwrites],
    },
  },
]
