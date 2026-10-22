import js from '@eslint/js'
import globals from 'globals'
import reactHooks from 'eslint-plugin-react-hooks'
import reactRefresh from 'eslint-plugin-react-refresh'
import { defineConfig, globalIgnores } from 'eslint/config'

export default defineConfig([
  globalIgnores(['dist']),
  {
    files: ['**/*.{js,jsx}'],
    extends: [
      js.configs.recommended,
      reactHooks.configs.flat.recommended,
      reactRefresh.configs.vite,
    ],
    languageOptions: {
      globals: globals.browser,
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
  },
  {
    // react-three-fiber code legitimately mutates three.js objects and reads refs inside frame callbacks;
    // these React-Compiler-style rules misread that as a bug, so they are off for the 3D folder only.
    files: ['src/components/3d design/**/*.{js,jsx}'],
    rules: {
      'react-hooks/immutability': 'off',
      'react-hooks/refs': 'off',
      'react-refresh/only-export-components': 'off',
    },
  },
  {
    // These effects sync React with outside systems (theme observer, timers, WebGL probing): worth a look, not an error.
    files: ['**/*.{js,jsx}'],
    rules: { 'react-hooks/set-state-in-effect': 'warn' },
  },
])
