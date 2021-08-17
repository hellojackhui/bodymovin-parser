import typescript from "rollup-plugin-typescript";
import sourceMaps from "rollup-plugin-sourcemaps";
import commonjs from "rollup-plugin-commonjs";
import { uglify } from "rollup-plugin-uglify";
import banner from "rollup-plugin-banner";

const lerna = require("./lerna.json");
const bannerText =
  ` bodymovin-parser v${lerna.version}\n` +
  ` (c) 2021-${new Date().getFullYear()} hellojackhui\n` +
  " Released under the MIT License."

const configs = {
  rollupCore: {
    input: "packages/lottie-compiler-core/src/index.ts",
    output: [
      {
        file: "packages/lottie-compiler-core/lib/lottie-compiler-core.iife.js",
        format: "iife",
      },
      {
        file: "packages/lottie-compiler-core/lib/lottie-compiler-core.umd.js",
        name: "core",
        format: "umd",
      },
      {
        file: "packages/lottie-compiler-core/lib/lottie-compiler-core.es.js",
        name: "core",
        format: "es",
      },
    ],
  },
  rollupMp: {
    input: "packages/lottie-compiler-mp/src/index.ts",
    output: [
      {
        file: "packages/lottie-compiler-mp/lib/lottie-compiler-mp.iife.js",
        format: "iife",
      },
      {
        file: "packages/lottie-compiler-mp/lib/lottie-compiler-mp.umd.js",
        name: "core",
        format: "umd",
      },
      {
        file: "packages/lottie-compiler-mp/lib/lottie-compiler-mp.es.js",
        name: "core",
        format: "es",
      },
    ],
  },
  rollupCss: {
    input: "packages/lottie-compiler-web/src/index.ts",
    output: [
      {
        file: "packages/lottie-compiler-web/lib/lottie-compiler-web.umd.js",
        name: "core",
        format: "umd",
      },
      {
        file: "packages/lottie-compiler-web/lib/lottie-compiler-web.es.js",
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

const outputConf = {
  input: mode.input,
  output: mode.output,
}

const commonConf = {
  watch: {
    include: "src/**",
  },
}

const pluginConf = {
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
}

export default Object.assign({}, outputConf, commonConf, pluginConf);
