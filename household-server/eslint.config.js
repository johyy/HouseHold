import js from '@eslint/js';

export default [
  js.configs.recommended,
  {
    files: ['**/*.js'],
    ignores: ['node_modules', 'dist'], 
    languageOptions: {
      ecmaVersion: 'latest', 
      sourceType: 'module', 
      globals: {
        require: 'readonly',
        module: 'readonly',
        __dirname: 'readonly',
        process: 'readonly',
        console: 'readonly',
      },
    },
    rules: {
      'no-unused-vars': 'warn', 
      'no-console': 'off', 
      'strict': ['error', 'global'], 
    },
  },
];
