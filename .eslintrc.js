module.exports = {
  root: true,
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
  },
  env: {
    node: true,
    browser: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
  ],
  plugins: ['@typescript-eslint'],
  rules: {
    // 通用规则
    'semi': 'off',
    '@typescript-eslint/semi': ['error', 'always'],
    'no-var': 'error',
    'prefer-const': 'error',
    'camelcase': 'error',
    'no-console': 'warn',
    'no-debugger': 'error',
    
    // 代码格式
    'indent': 'off',
    '@typescript-eslint/indent': ['error', 2],
    'brace-style': ['error', '1tbs'],
    'space-infix-ops': 'error',
    'comma-spacing': ['error', { before: false, after: true }],
    'keyword-spacing': 'error',
    'spaced-comment': ['error', 'always'],
    
    // 文件命名
    'filenames/match-regex': [
      'error',
      '^[a-z0-9.-]+$', // 小写字母、数字、点和连字符
    ],
  },
  overrides: [
    {
      files: ['backend/**/*.ts'],
      extends: ['./backend/.eslintrc.js'],
    },
    {
      files: ['frontend/**/*.{ts,tsx}'],
      extends: ['./frontend/.eslintrc.js'],
    },
  ],
};