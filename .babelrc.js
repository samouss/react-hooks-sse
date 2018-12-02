const isESModules = process.env.BABEL_ENV === 'esm';

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: ['>0.25%', 'not dead', 'not ie <= 11', 'not op_mini all'],
        modules: !isESModules ? 'commonjs' : false,
        useBuiltIns: false,
      },
    ],
  ],
  plugins: [
    [
      '@babel/plugin-transform-runtime',
      {
        useESModules: isESModules,
      },
    ],
  ],
};
