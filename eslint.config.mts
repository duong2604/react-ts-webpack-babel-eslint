import js from '@eslint/js'
import globals from 'globals'
import tseslint from 'typescript-eslint'
import pluginReact from 'eslint-plugin-react'
import pluginReactHooks from 'eslint-plugin-react-hooks'
import pluginImport from 'eslint-plugin-import'
import pluginA11y from 'eslint-plugin-jsx-a11y'
import pluginPrettier from 'eslint-plugin-prettier'
import { defineConfig } from 'eslint/config'
import path from 'path'

export default defineConfig([
  {
    ignores: ['node_modules/', 'dist/', 'build/']
  },

  js.configs.recommended,
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended,

  {
    files: ['**/*.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'],
    languageOptions: {
      globals: {
        ...globals.browser,
        ...globals.node
      },
      parserOptions: {
        ecmaVersion: 'latest',
        sourceType: 'module'
      }
    },
    plugins: {
      react: pluginReact,
      'react-hooks': pluginReactHooks,
      import: pluginImport,
      'jsx-a11y': pluginA11y,
      prettier: pluginPrettier
    },
    settings: {
      react: { version: 'detect' },
      'import/resolver': {
        alias: {
          map: [
            ['@', path.resolve('./src')],
            ['@components', path.resolve('./src/components')],
            ['@utils', path.resolve('./src/utils')],
            ['@constants', path.resolve('./src/constants')],
            ['@hooks', path.resolve('./src/hooks')],
            ['@pages', path.resolve('./src/pages')],
            ['@styles', path.resolve('./src/styles')],
            ['@assets', path.resolve('./src/assets')],
            ['@helpers', path.resolve('./src/helpers')]
          ],
          extensions: ['.js', '.jsx', '.ts', '.tsx']
        },
        node: {
          paths: [path.resolve()],
          extensions: ['.js', '.jsx', '.ts', '.tsx']
        }
      }
    },

    rules: {
      // --- Core Style & Convention ---
      eqeqeq: ['error', 'always', { null: 'ignore' }],
      'no-console': ['error', { allow: ['warn', 'error'] }],
      'no-alert': 'error',
      'no-var': 'error',
      'prefer-const': 'error',
      'no-undef': 'error',
      'no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
      'no-magic-numbers': [
        'error',
        { ignore: [0, 1, -1], ignoreArrayIndexes: true, enforceConst: true }
      ],
      'no-shadow': 'error',
      'no-duplicate-imports': 'error',
      'consistent-return': 'error',
      'no-nested-ternary': 'warn',
      'no-extra-boolean-cast': 'warn',

      // --- Code Maintainability ---
      complexity: ['warn', { max: 10 }],
      'max-lines': [
        'warn',
        { max: 500, skipBlankLines: true, skipComments: true }
      ],
      'max-depth': ['warn', 4],

      // ---  Import/Module conventions ---
      'import/order': [
        'error',
        {
          groups: [
            ['builtin', 'external'],
            ['internal'],
            ['parent', 'sibling', 'index']
          ],
          'newlines-between': 'always',
          alphabetize: { order: 'asc', caseInsensitive: true }
        }
      ],
      'import/no-unresolved': 'error',
      'import/no-extraneous-dependencies': 'warn',

      // --- React conventions ---
      'react/react-in-jsx-scope': 'off',
      'react/jsx-no-target-blank': 'warn',
      'react/prop-types': 'off',
      'react/self-closing-comp': 'warn',
      'react/jsx-curly-brace-presence': [
        'warn',
        { props: 'never', children: 'never' }
      ],
      ...pluginReactHooks.configs.recommended.rules,

      ...pluginA11y.configs.recommended.rules,

      'prettier/prettier': [
        'warn',
        {
          arrowParens: 'always',
          semi: false,
          trailingComma: 'none',
          tabWidth: 2,
          endOfLine: 'auto',
          useTabs: false,
          singleQuote: true,
          printWidth: 80,
          jsxSingleQuote: true
        }
      ]
    }
  }
])
