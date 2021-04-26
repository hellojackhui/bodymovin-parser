import typescript from "rollup-plugin-typescript";
import { uglify } from 'rollup-plugin-uglify';

export default {
  input: "packages/core/index.ts",
  output: [
    {
      file: "lib/core.iife.js",
      format: "iife",
    },
    {
      file: "lib/core.umd.js",
      name: 'core',
      format: "umd",
    },
    {
      file: "lib/core.es.js",
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