const isESModules = process.env.BABEL_ENV === 'esm';
const isRollup = process.env.BABEL_ENV === 'rollup';
const plugins = [];

if (!isRollup) {
  plugins.push([
    '@babel/plugin-transform-runtime',
    {
      useESModules: isESModules,
    },
  ]);
}

module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        targets: ['>0.25%', 'not dead', 'not ie <= 11', 'not op_mini all'],
        modules: !isESModules && !isRollup ? 'commonjs' : false,
        useBuiltIns: false,
      },
    ],
    [
      '@babel/preset-typescript',
      {
        isTSX: false,
        allExtensions: false,
      },
    ],
  ],
  plugins,
};
