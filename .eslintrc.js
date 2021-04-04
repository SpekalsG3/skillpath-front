module.exports = {
  env: {
    browser: true,
    es6: true,
    node: true,
  },
  extends: ['plugin:react/recommended'],
  globals: {
    Atomics: 'readonly',
    SharedArrayBuffer: 'readonly',
    process: 'readonly',
  },
  parserOptions: {
    ecmaFeatures: {
      jsx: true,
    },
    ecmaVersion: 11,
    sourceType: 'module',
  },
  plugins: ['react'],
  rules: {
    camelcase: 'off',
    'react/react-in-jsx-scope': 'off',
    'comma-dangle': ['error', 'always-multiline'],
    'max-len': ['error', { code: 150 }],
    'jsx-quotes': [2, 'prefer-double'],
    'react/prop-types': 'off',
  },
}
