# react-datatable-library — Full setup guide

This document adds a **complete step-by-step guide** to build, bundle, and publish the `react-datatable-library` to npm. It includes a recommended folder structure, `package.json`, required packages, build scripts (Rollup and Vite options), and publish steps.

---

## 1) Goals

- Build a small, dependency-light React datatable component library.
- Support both ESM and CJS consumers.
- Provide TypeScript types (optional but recommended).
- Publish a tidy package to `npm` with clear build + test scripts.

---

## 2) Recommended folder structure

```
react-datatable-library/
├─ .github/
│  └─ workflows/ci.yml            # optional CI for tests/builds
├─ dist/                          # build output (ignored in git)
├─ src/
│  ├─ index.js                    # library entry (ESM)
│  ├─ index.cjs.js                # optional CJS entry point (or generated)
│  ├─ components/
│  │  └─ DataTable.jsx
│  ├─ styles.css
│  └─ types.d.ts                  # TypeScript declarations (if using TS)
├─ example/                       # optional demo app (Vite/CRA) for local testing
│  └─ (example app files)
├─ test/                          # unit tests (jest/vitest)
├─ .gitignore
├─ package.json
├─ README.md
├─ CHANGELOG.md
├─ rollup.config.js               # if using Rollup
├─ vite.config.ts                 # if using Vite library mode (optional)
├─ tsconfig.json                  # if using TypeScript
└─ LICENSE
```

---

## 3) Which toolchain to pick (short)

- **Rollup** — battle-tested for libraries; small config; produces ESM + CJS + UMD easily.
- **Vite (library mode)** — also excellent and faster dev experience; produces bundles via Rollup under the hood.

Below I provide a **Rollup-based** setup (widely used and predictable) and then a short **Vite alternative**.

---

## 4) package.json (example)

Create `package.json` with the following contents (adjust name/version/description):

```json
{
  "name": "react-datatable-library",
  "version": "0.1.0",
  "description": "Lightweight React DataTable component",
  "main": "dist/index.cjs.js",
  "module": "dist/index.esm.js",
  "types": "dist/types.d.ts",
  "files": ["dist"],
  "sideEffects": false,
  "scripts": {
    "clean": "rimraf dist",
    "build": "npm run clean && rollup -c",
    "build:types": "tsc --emitDeclarationOnly",
    "prepare": "npm run build",
    "lint": "eslint src --ext .js,.jsx,.ts,.tsx",
    "test": "vitest run",
    "dev:example": "cd example && npm run dev"
  },
  "keywords": ["react","datatable","table","ui"],
  "author": "Your Name",
  "license": "MIT",
  "peerDependencies": {
    "react": "^16.8.0 || ^17 || ^18",
    "react-dom": "^16.8.0 || ^17 || ^18"
  },
  "devDependencies": {
    "@rollup/plugin-commonjs": "^",
    "@rollup/plugin-node-resolve": "^",
    "@rollup/plugin-babel": "^",
    "rollup": "^",
    "rollup-plugin-peer-deps-external": "^",
    "rollup-plugin-terser": "^",
    "prop-types": "^",
    "rimraf": "^",
    "eslint": "^",
    "vitest": "^",
    "@babel/core": "^",
    "@babel/preset-env": "^",
    "@babel/preset-react": "^",
    "typescript": "^"
  }
}
```

> **Notes**:
> - Keep `react` and `react-dom` as `peerDependencies` so the host app provides React.
> - `files` controls what gets published — keep it minimal (only `dist`).

---

## 5) Install packages — commands

Open a terminal inside your library root and run:

```bash
# initialize project
npm init -y

# install runtime deps
npm install prop-types

# install dev deps (Rollup approach)
npm install -D rollup rollup-plugin-peer-deps-external @rollup/plugin-node-resolve @rollup/plugin-commonjs @rollup/plugin-babel @babel/core @babel/preset-env @babel/preset-react rollup-plugin-terser rimraf eslint vitest typescript

# (optional) if using PostCSS/SCSS or CSS modules add those build plugins
```

If you choose **Vite** instead of Rollup directly, install:

```bash
npm install -D vite @vitejs/plugin-react
# and other build/test/dev deps (typescript/vitest/etc.)
```

---

## 6) Rollup config (example)

Create `rollup.config.js` at project root:

```js
import peerDepsExternal from "rollup-plugin-peer-deps-external";
import resolve from "@rollup/plugin-node-resolve";
import commonjs from "@rollup/plugin-commonjs";
import babel from "@rollup/plugin-babel";
import { terser } from "rollup-plugin-terser";

const extensions = [".js", ".jsx", ".ts", ".tsx"];

export default {
  input: "src/index.js",
  output: [
    {
      file: "dist/index.esm.js",
      format: "es",
      sourcemap: true
    },
    {
      file: "dist/index.cjs.js",
      format: "cjs",
      exports: "named",
      sourcemap: true
    }
  ],
  plugins: [
    peerDepsExternal(),
    resolve({ extensions }),
    commonjs(),
    babel({
      extensions,
      babelHelpers: "bundled",
      exclude: "node_modules/**",
      presets: ["@babel/preset-env", "@babel/preset-react"]
    }),
    terser()
  ]
};
```

---

## 7) Source entry & exports

`src/index.js` should export the component(s):

```js
// src/index.js
export { default as DataTable } from './components/DataTable';
```

And `src/components/DataTable.jsx` contains the component implementation. Keep the API stable and documented.

---

## 8) TypeScript / types

If you want to ship `.d.ts` files:

1. Add `typescript` to devDependencies (already in package.json example).
2. Create `tsconfig.json` with `declaration: true` and `emitDeclarationOnly` when running `tsc`.
3. Add a `build:types` script: `tsc --emitDeclarationOnly --declaration --declarationDir dist`.

Example `tsconfig.json` (minimal):

```json
{
  "compilerOptions": {
    "target": "ES6",
    "module": "ESNext",
    "jsx": "react",
    "declaration": true,
    "emitDeclarationOnly": true,
    "outDir": "dist",
    "strict": true,
    "esModuleInterop": true
  },
  "include": ["src"]
}
```

Run `npm run build` (which runs rollup) then `npm run build:types` so `dist/` contains `index.esm.js`, `index.cjs.js` and `types.d.ts`.

---

## 9) CSS handling

Simplest approach: ship a plain `.css` file and ask consumers to import it, e.g.

```js
// usage in consumer
import 'react-datatable-library/dist/styles.css'
import { DataTable } from 'react-datatable-library'
```

If you prefer to inline CSS into the bundle, add a PostCSS or rollup-plugin-postcss step to the Rollup plugins.

---

## 10) Example / demo app

Create an `example` folder with a small Vite or CRA app that installs your local package via relative path for development:

```bash
# from example/ folder
npm install ../
npm run dev
```

This helps you test the published build and ensure tree-shaking and CSS import behave correctly.

---

## 11) Tests and linting

- Use `vitest` for unit tests.
- Use `eslint` + `eslint-plugin-react` for linting.

Example `test` script in `package.json`: `vitest run`.

---

## 12) Publish steps (one-time setup)

1. Make sure you have an npm account: `npm login`.
2. Update `package.json` fields: `name`, `version`, `repository`, `author`, `license`.
3. Ensure `dist` is buildable and `files` contains only what you want to publish.
4. Build the package: `npm run build && npm run build:types`.
5. Verify the `dist/` contents.
6. Publish: `npm publish --access public` (use `--access public` for scoped packages like `@your-scope/name`).

**Tip:** use `npm pack` to generate a tarball and inspect exactly what will be published before running `npm publish`.

---

## 13) Versioning & releases

- Use semantic versioning (semver).
- Consider adding a release workflow in GitHub Actions to build, test, create changelog and publish on tag push.

---

## 14) Vite library mode (alternative)

If you prefer Vite, create `vite.config.ts`:

```ts
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  build: {
    lib: {
      entry: 'src/index.js',
      name: 'ReactDataTableLibrary',
      fileName: (format) => `index.${format}.js`
    },
    rollupOptions: {
      // externalize peer deps
      external: ['react', 'react-dom'],
      output: {
        globals: {
          react: 'React'
        }
      }
    }
  }
})
```

Then build with `vite build`.

---

## 15) Quick checklist before publishing

- [ ] Peer deps declared (react, react-dom)
- [ ] `files` in `package.json` only includes `dist`
- [ ] `sideEffects: false` if your modules are pure
- [ ] Types shipped (`types` field in package.json)
- [ ] README with usage examples
- [ ] License
- [ ] Tests passing

---

## 16) Example commands summary (copy/paste)

```bash
# init
npm init -y
npm install prop-types
npm install -D rollup rollup-plugin-peer-deps-external @rollup/plugin-node-resolve @rollup/plugin-commonjs @rollup/plugin-babel @babel/core @babel/preset-env @babel/preset-react rollup-plugin-terser rimraf eslint vitest typescript

# build
npm run build

```

---

## 17) Want me to do this for you?

I can now update the canvas `src/` files to include:
- `src/components/DataTable.jsx` (improved API: pagination, sorting placeholders)
- `rollup.config.js`
- `package.json` (filled with exact versions)
- `README.md` example usage

Reply **"Yes — add the build files"** and I will populate the canvas with the full runnable project files and scripts.

---

If you'd prefer the Vite variant, tell me **"Use Vite"** and I will generate a Vite library config + example app in `example/`.
