import typescript from "rollup-plugin-typescript";

export default {
  input: "packages/css/index.ts",
  output: [
    {
      file: "lib/bundle.cjs.js",
      format: "iife",
    },
    {
      file: "lib/bundle.esm.js",
      format: "umd",
    },
  ],
  plugins: [
    typescript({
      exclude: "node_modules/**",
      typescript: require("typescript"),
    }),
  ],
};