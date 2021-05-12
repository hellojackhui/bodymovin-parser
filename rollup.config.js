import typescript from "rollup-plugin-typescript";
import commonjs from "rollup-plugin-commonjs";
import { uglify } from 'rollup-plugin-uglify';

const rollupCore = {
  input: 'packages/compiler-core/src/index.ts',
  output: [
    {
      file: "packages/compiler-core/lib/compiler-core.iife.js",
      format: "iife",
    },
    {
      file: "packages/compiler-core/lib/compiler-core.umd.js",
      name: 'core',
      format: "umd",
    },
    {
      file: "packages/compiler-core/lib/compiler-core.es.js",
      name: 'core',
      format: "es",
    }
  ]
}

const rollupCss = {
  input: 'packages/compiler-css/src/index.ts',
  output: [
    {
      file: "lib/compiler-css/compiler-css.umd.js",
      name: 'core',
      format: "umd",
    },
    {
      file: "lib/compiler-css/compiler-css.es.js",
      name: 'core',
      format: "es",
    }
  ]
}


const mode = rollupCore;

export default {
  input: mode.input,
  output: mode.output,
  plugins: [
    typescript({
      exclude: "node_modules/**",
      typescript: require("typescript"),
    }),
    uglify(),
    commonjs({
      include: ['packages/**/*.js'],
      exclude: ['node_modules/'],
      extensions: [ '.js', '.coffee' ],

    })
  ],
};