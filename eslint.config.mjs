import js from '@eslint/js';
import prettierPlugin from 'eslint-plugin-prettier';
import nextPlugin from '@next/eslint-plugin-next';

/**
 * Flat config requires plugins as objects with their configs, not arrays of strings.
 * So instead of { plugins: ["@next/next"] }, we do:
 *   plugins: { '@next/next': nextPlugin }
 */

export default [
  js.configs.recommended,
  {
    files: ['app/**/*.{js,jsx,ts,tsx}', 'utils/**/*.{js,jsx,ts,tsx}'],
    ignores: ['**/*', '!app/**/*', '!utils/**/*'],
    plugins: {
      '@next/next': nextPlugin,
      prettier: prettierPlugin,
    },
    rules: {
      ...nextPlugin.configs.recommended.rules, // "plugin:@next/next/recommended"
      ...prettierPlugin.configs.recommended.rules, // "plugin:prettier/recommended"

      'prettier/prettier': 'error',
      // you can also override Next.js rules here if needed
      '@next/next/no-html-link-for-pages': 'warn',
    },
    languageOptions: {
      ecmaVersion: 'latest',
      sourceType: 'module',
    },
  },
];
