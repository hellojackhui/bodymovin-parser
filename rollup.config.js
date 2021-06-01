import typescript from "rollup-plugin-typescript";
import sourceMaps from "rollup-plugin-sourcemaps";
import commonjs from "rollup-plugin-commonjs";
import { uglify } from "rollup-plugin-uglify";
import banner from "rollup-plugin-banner";

const pkg = require("./package.json");
const bannerText =
  ` bodymovin-parser v${pkg.version}\n` +
  ` (c) 2020-${new Date().getFullYear()} hellojackhui\n` +
  " Released under the MIT License."

const configs = {
  rollupCore: {
    input: "packages/compiler-core/src/index.ts",
    output: [
      {
        file: "packages/compiler-core/lib/compiler-core.iife.js",
        format: "iife",
      },
      {
        file: "packages/compiler-core/lib/compiler-core.umd.js",
        name: "core",
        format: "umd",
      },
      {
        file: "packages/compiler-core/lib/compiler-core.es.js",
        name: "core",
        format: "es",
      },
    ],
  },
  rollupMp: {
    input: "packages/compiler-mp/src/index.ts",
    output: [
      {
        file: "packages/compiler-mp/lib/compiler-mp.iife.js",
        format: "iife",
      },
      {
        file: "packages/compiler-mp/lib/compiler-mp.umd.js",
        name: "core",
        format: "umd",
      },
      {
        file: "packages/compiler-mp/lib/compiler-mp.es.js",
        name: "core",
        format: "es",
      },
    ],
  },
  rollupCss: {
    input: "packages/compiler-web/src/index.ts",
    output: [
      {
        file: "packages/compiler-web/lib/compiler-web.umd.js",
        name: "core",
        format: "umd",
      },
      {
        file: "packages/compiler-web/lib/compiler-web.es.js",
        name: "core",
        format: "es",
      },
    ],
  },
};

let mode;
const praseEnv = () => {
  const [, , , args] = process.argv;
  let envName = args.split("--")[1];
  mode = configs[envName];
};
praseEnv();

export default {
  input: mode.input,
  output: mode.output,
  watch: {
    include: "src/**",
  },
  plugins: [
    typescript({
      exclude: "node_modules/**",
      typescript: require("typescript"),
    }),
    uglify(),
    commonjs({
      include: ["packages/**/*.js"],
      exclude: ["node_modules/"],
      extensions: [".js", ".coffee"],
    }),
    sourceMaps(),
    banner(bannerText),
  ],
};
