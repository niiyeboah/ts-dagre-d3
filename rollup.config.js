import nodeResolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import copy from 'rollup-plugin-copy';

export default {
  input: 'src/dagre-d3.js',
  output: { format: 'es', dir: 'dist' },
  plugins: [
    commonjs(),
    nodeResolve(),
    copy({
      targets: [{ src: 'src/dagre-d3.d.ts', dest: 'dist' }]
    })
  ]
};
