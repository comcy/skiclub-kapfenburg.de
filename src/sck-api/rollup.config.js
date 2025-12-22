// rollup.config.mjs
import typescript from '@rollup/plugin-typescript';
import resolve from '@rollup/plugin-node-resolve';
import commonjs from '@rollup/plugin-commonjs';
import { terser } from 'rollup-plugin-terser';
import json from '@rollup/plugin-json';

export default {
  input: 'src/index.ts', 
  output: {
    file: 'dist/index.js', 
    format: 'esm',         
    sourcemap: true,       
  },
  plugins: [
    resolve({
      preferBuiltins: true,
    }),
    commonjs(),
    typescript({ tsconfig: './tsconfig.json' }),
    terser(), 
    json(),
  ],
  external: [
    'express',
    'nodemailer',
    'cors',
    'dotenv'
  ],
};
