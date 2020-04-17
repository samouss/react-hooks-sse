import resolve from 'rollup-plugin-node-resolve';
import commonjs from 'rollup-plugin-commonjs';
import babel from 'rollup-plugin-babel';
import { terser } from 'rollup-plugin-terser';

const clean = x => x.filter(Boolean);
const configuration = ({ minify }) => ({
  input: 'src/index.ts',
  output: {
    file: `dist/umd/ReactHookSSE${minify ? '.min' : ''}.js`,
    format: 'umd',
    name: 'ReactHookSSE',
    sourcemap: true,
    globals: {
      react: 'React',
    },
  },
  external: ['react'],
  plugins: clean([
    babel({
      exclude: 'node_modules/**',
      extensions: ['.ts'],
    }),
    resolve({
      extensions: ['.ts'],
    }),
    commonjs({
      namedExports: {
        react: [
          'createElement',
          'createContext',
          'useState',
          'useContext',
          'useEffect',
        ],
      },
    }),
    minify && terser(),
  ]),
});

export default [
  configuration({
    minify: false,
  }),
  configuration({
    minify: true,
  }),
];
