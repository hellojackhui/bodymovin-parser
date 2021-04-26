import typescript from "rollup-plugin-typescript";
import { uglify } from 'rollup-plugin-uglify';

export default {
  input: "packages/compiler-core/src/index.ts",
  output: [
    {
      file: "lib/compiler-core.iife.js",
      format: "iife",
    },
    {
      file: "lib/compiler-core.umd.js",
      name: 'core',
      format: "umd",
    },
    {
      file: "lib/compiler-core.es.js",
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