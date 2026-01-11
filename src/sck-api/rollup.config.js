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
    format: 'cjs',         
    sourcemap: true,       
  },
  plugins: [
    resolve({
      preferBuiltins: true,
    }),
    commonjs({
      include: 'node_modules/**', 
      ignore: ['node_modules/@tsoa/cli/dist/cli.js'],
    }),
    typescript({ tsconfig: './tsconfig.json' }),
    terser(), 
    json(),
  ],
  external: [
    'nodemailer',
    'cors',
    'dotenv',
    '@tsoa/cli',
    'multer'
  ],
};
