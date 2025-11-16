// rollup.config.cjs
const peerDepsExternal = require("rollup-plugin-peer-deps-external");
const resolve = require("@rollup/plugin-node-resolve").default;
const commonjs = require("@rollup/plugin-commonjs");
const babel = require("@rollup/plugin-babel").babel;
// ✅ Import terser as default
const terser = require("@rollup/plugin-terser");

const extensions = [".js", ".jsx", ".ts", ".tsx"];

module.exports = {
  input: "src/index.js",
  output: [
    { file: "dist/index.esm.js", format: "es", sourcemap: true },
    { file: "dist/index.cjs.js", format: "cjs", exports: "named", sourcemap: true },
  ],
  external: [
    "react",
    "react-dom",
    "clsx",
    "tailwind-merge",
    "class-variance-authority",
  ],
  
  plugins: [
    peerDepsExternal(),
    resolve({ extensions }),
    commonjs(),
    babel({
      extensions,
      babelHelpers: "bundled",
      include: ["src/**/*.{js,jsx,ts,tsx}"],
      presets: ["@babel/preset-env", "@babel/preset-react"],
    }),
    terser(), // ✅ now works
  ],
};
