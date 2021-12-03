import resolve from '@rollup/plugin-node-resolve';

export default {
  input: 'src/index.js',
  output: {
    file: "src/dist/bundle.js",
    format: 'esm'
  },
  plugins: [ resolve() ]
};