import tsPlugin from '@typescript-eslint/eslint-plugin';
import tsParser from '@typescript-eslint/parser';

export default [
  {
    ignores: ['node_modules', 'dist', 'build', 'tsconfig.json'],
  },
  {
    files: ['**/*.ts', '**/*.js'],
    languageOptions: {
      parser: tsParser, // TypeScript 파서
      parserOptions: {
        ecmaVersion: 2021,
        sourceType: 'module',
        //project: './tsconfig.json', // tsconfig.json 경로 추가
      },
    },
    plugins: {
      '@typescript-eslint': tsPlugin, // 플러그인을 객체로 추가
    },
    rules: {
      semi: ['error', 'always'],
      quotes: ['error', 'single'],
      '@typescript-eslint/no-namespace': 'off', // namespace 허용
    },
  },
];
