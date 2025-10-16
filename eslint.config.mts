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
            ['@utils', path.resolve('./src/utils')]
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
      'react/react-in-jsx-scope': 'off',
      'react/jsx-no-target-blank': 'warn',
      ...pluginReactHooks.configs.recommended.rules,
      ...pluginImport.configs.recommended.rules,
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
  },
  ...tseslint.configs.recommended,
  pluginReact.configs.flat.recommended
])
