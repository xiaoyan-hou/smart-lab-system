module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    node: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    // 分号要求 - 强制使用分号
    'semi': 'off',
    '@typescript-eslint/semi': ['error', 'always'],
    
    // 禁止使用 var
    'no-var': 'error',
    
    // 必须使用 const 或 let
    'prefer-const': 'error',
    
    // 代码质量
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': 'warn',
    'no-debugger': 'error',
  },
};