import js from '@eslint/js';
import tseslint from 'typescript-eslint';

export default [
  js.config({
    env: {
      es2021: true,
      node: true
    }
  }),
  ...tseslint.config({
    files: ['**/*.ts'],
    rules: {
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/no-explicit-any': 'off'
    }
  })
];
