module.exports = {
  extends: ['airbnb', 'prettier'],
  env: {
    browser: true,
    jest: true,
  },
  plugins: ['prettier'],
  rules: {
    'import/prefer-default-export': 0,
    'prettier/prettier': 'error',
    'react/jsx-filename-extension': [
      1,
      {
        extensions: ['.js', '.jsx'],
      },
    ],
  },
};
