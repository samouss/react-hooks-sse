module.exports = {
  root: true,
  env: { browser: true, jest: true },
  plugins: ['prettier'],
  extends: ['airbnb', 'prettier'],
  overrides: [
    {
      files: ['*.ts'],
      parser: '@typescript-eslint/parser',
      parserOptions: { project: './tsconfig.json' },
      plugins: ['@typescript-eslint', 'prettier'],
      extends: ['airbnb-typescript', 'prettier', 'prettier/@typescript-eslint'],
      rules: {
        'import/prefer-default-export': 0,
      },
    },
  ],
};
