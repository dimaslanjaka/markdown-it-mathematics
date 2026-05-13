import commonjs from '@rollup/plugin-commonjs';
import json from '@rollup/plugin-json';
import resolve from '@rollup/plugin-node-resolve';
import typescript from '@rollup/plugin-typescript';
import * as glob from 'glob';
import path from 'path';
import { fileURLToPath } from 'url';
import { external, tsconfig } from './rollup.utils.js';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

/**
 * @type {import('rollup').RollupOptions['input']}
 */
const inputs = glob.globSync('src/**/*.{ts,js,cjs,mjs}', { posix: true });

/**
 * @type {import('rollup').RollupOptions}
 */
const cjs = {
  input: inputs,
  output: [
    {
      dir: 'dist',
      format: 'cjs',
      sourcemap: false,
      preserveModules: true,
      exports: 'named'
    },
    {
      dir: 'dist',
      format: 'esm',
      sourcemap: false,
      preserveModules: true,
      exports: 'named',
      entryFileNames: '[name].mjs'
    }
  ],
  plugins: [
    resolve({ preferBuiltins: true }), // Resolve node_modules packages
    commonjs(), // Convert CommonJS modules to ES6
    typescript({
      tsconfig: 'tsconfig.json',
      compilerOptions: { ...tsconfig.compilerOptions, declaration: true },
      include: ['./src/**/*']
    }), // Compile TypeScript files
    json() // Support for JSON files
  ],
  external // External dependencies package name to exclude from bundle
};

export default cjs;
