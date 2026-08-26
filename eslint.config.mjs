import js from '@eslint/js';
import { defineConfig } from 'eslint/config';
import tseslint from 'typescript-eslint';
import eslintConfigPrettier from 'eslint-config-prettier';
import globals from 'globals';

export default defineConfig(
  {
    files: ['**/*.{js,ts,mjs}'],
    extends: [js.configs.recommended, tseslint.configs.recommended, eslintConfigPrettier],
  },
  {
    files: ['**/*.mjs'],
    languageOptions: {
      globals: globals.node,
    },
  },
  {
    ignores: [
      'dist/',
      'node_modules/',
      'src/data/',
      '.repo-tmp/',
      '.staging/',
      '.pnp.cjs',
      '.pnp.loader.mjs',
    ],
  }
);
