import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';
import { terser } from 'rollup-plugin-terser';

const raw = {
  input: 'src/dagre-d3.js',
  output: { file: 'dist/dagre-d3.js', format: 'es' },
  plugins: [
    commonjs(),
    nodeResolve(),
    copy({
      targets: [{ src: 'src/dagre-d3.d.ts', dest: 'dist' }]
    })
  ]
};

const minified = {
  ...raw,
  output: { file: 'dist/dagre-d3.min.js', format: 'es' },
  plugins: [...raw.plugins, terser()]
};

export default [raw, minified];
