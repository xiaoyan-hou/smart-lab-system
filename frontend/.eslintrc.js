module.exports = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    ecmaVersion: 2020,
    sourceType: 'module',
    ecmaFeatures: {
      jsx: true,
    },
    project: './tsconfig.json',
  },
  env: {
    browser: true,
    node: true,
    es6: true,
  },
  extends: [
    'eslint:recommended',
    '@typescript-eslint/recommended',
    '@typescript-eslint/recommended-requiring-type-checking',
    'plugin:react/recommended',
    'plugin:react-hooks/recommended',
  ],
  plugins: ['@typescript-eslint', 'react', 'react-hooks'],
  settings: {
    react: {
      version: 'detect',
    },
  },
  rules: {
    // 分号要求 - 强制使用分号
    'semi': 'off',
    '@typescript-eslint/semi': ['error', 'always'],
    
    // 禁止使用 var
    'no-var': 'error',
    
    // 必须使用 const 或 let
    'prefer-const': 'error',
    
    // 类型声明要求
    '@typescript-eslint/explicit-function-return-type': 'error',
    '@typescript-eslint/explicit-module-boundary-types': 'error',
    '@typescript-eslint/no-explicit-any': 'error',
    
    // 命名规范
    'camelcase': 'error',
    '@typescript-eslint/naming-convention': [
      'error',
      {
        selector: 'variable',
        format: ['camelCase', 'UPPER_CASE'],
      },
      {
        selector: 'function',
        format: ['camelCase'],
      },
      {
        selector: 'interface',
        format: ['PascalCase'],
        prefix: ['I'],
      },
      {
        selector: 'typeAlias',
        format: ['PascalCase'],
      },
      {
        selector: 'component',
        format: ['PascalCase'],
      },
    ],
    
    // 代码格式
    'indent': 'off',
    '@typescript-eslint/indent': ['error', 2],
    
    // 括号风格
    'brace-style': ['error', '1tbs'],
    
    // 空格使用
    'space-infix-ops': 'error',
    'comma-spacing': ['error', { before: false, after: true }],
    'keyword-spacing': 'error',
    
    // React 特定规则
    'react/prop-types': 'off', // TypeScript 处理类型检查
    'react/react-in-jsx-scope': 'off', // React 17+ 不需要导入 React
    'react/jsx-uses-react': 'error',
    'react/jsx-uses-vars': 'error',
    
    // React Hooks 规则
    'react-hooks/rules-of-hooks': 'error',
    'react-hooks/exhaustive-deps': 'warn',
    
    // JSX 规范
    'react/jsx-indent': ['error', 2],
    'react/jsx-indent-props': ['error', 2],
    'react/jsx-closing-bracket-location': ['error', 'tag-aligned'],
    
    // 导入顺序
    'import/order': [
      'error',
      {
        groups: [
          'builtin',
          'external',
          'internal',
          'parent',
          'sibling',
          'index',
        ],
        'newlines-between': 'always',
      },
    ],
    
    // 文件命名
    'filenames/match-regex': [
      'error',
      '^[a-z0-9.-]+$', // 小写字母、数字、点和连字符
    ],
    
    // 注释要求
    'spaced-comment': ['error', 'always'],
    
    // 代码质量
    'no-unused-vars': 'off',
    '@typescript-eslint/no-unused-vars': ['error', { argsIgnorePattern: '^_' }],
    'no-console': 'warn',
    'no-debugger': 'error',
    
    // 组件规范
    'react/function-component-definition': [
      'error',
      {
        namedComponents: 'arrow-function',
        unnamedComponents: 'arrow-function',
      },
    ],
    
    // 事件处理函数命名
    'react/jsx-handler-names': [
      'error',
      {
        eventHandlerPrefix: 'handle',
        eventHandlerPropPrefix: 'on',
      },
    ],
  },
  overrides: [
    {
      files: ['*.tsx'],
      rules: {
        'filenames/match-regex': ['error', '^[A-Z][a-zA-Z0-9]*$'], // PascalCase 组件文件
      },
    },
    {
      files: ['*.ts'],
      rules: {
        'filenames/match-regex': ['error', '^[a-z0-9-]+\.ts$'],
      },
    },
  ],
};