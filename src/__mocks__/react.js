const React = require.requireActual('react');

module.exports = {
  ...React,
  // see: https://github.com/facebook/react/issues/14050#issuecomment-438173736
  useEffect: React.useLayoutEffect,
};
