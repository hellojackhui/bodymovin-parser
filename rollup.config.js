import typescript from "rollup-plugin-typescript";
import { uglify } from 'rollup-plugin-uglify';

export default {
  input: "packages/core/index.ts",
  output: [
    {
      file: "lib/bundle.iife.js",
      format: "iife",
    },
    {
      file: "lib/bundle.umd.js",
      name: 'core',
      format: "umd",
    },
    {
      file: "lib/bundle.es.js",
      name: 'core',
      format: "es",
    }
  ],
  plugins: [
    typescript({
      exclude: "node_modules/**",
      typescript: require("typescript"),
    }),
    uglify()
  ],
};