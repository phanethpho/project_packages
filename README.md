# Project Packages — ReactJS Components (Monorepo)

This repository contains a collection of reusable React JavaScript components published as individual npm packages. This README is a single entry point describing all packages, installation, usage, development and publishing workflows.

## Packages
Each package lives under `packages/<package-name>` and is published separately to npm. Replace `<scope>` and `<package-name>` with your values.

Example package layout:
- packages/button — Accessible, themeable Button component
- packages/input — Controlled Input with validation helpers
- packages/modal — Lightweight Modal / Dialog component
- packages/icons — Shared SVG icon set
- packages/utils — Small utility helpers used by components

(Adjust the list to match your repository.)

## Install
Install a specific package from npm:
```
npm install @<scope>/<package-name>
# or
yarn add @<scope>/<package-name>
```

For local development (from monorepo root):
```
# If using npm workspaces / yarn workspaces / pnpm:
npm install
# then from the app:
npm install ../packages/button
```

## Usage (example)
Import and use components like:
```jsx
import React from "react";
import { Button } from "@<scope>/button";
import "@<scope>/button/dist/button.css";

function App() {
    return <Button variant="primary">Click me</Button>;
}
```

API details for each package are in `packages/<package-name>/README.md`.

## Theming & Styles
- Components include optional CSS/SCSS bundles or CSS-in-JS support depending on package.
- Import CSS manually when needed: `import "@<scope>/button/dist/button.css";`
- For theme tokens, see `packages/<package-name>/docs/theme.md` (if present).

## TypeScript
Packages ship TypeScript declarations (if applicable). Install types via the package or include `types` field in package.json.

## Development
Common commands (run from repo root or individual package folder):
- Install deps: `npm install`
- Build a package: `npm run build` (inside package)
- Watch for changes: `npm run dev` or `npm run watch`
- Run tests: `npm test`
- Run lint: `npm run lint`

Monorepo helpers:
- If using a tool (pnpm/lerna/yarn workspaces), use configured workspace commands from repo root, e.g. `pnpm -w run build`.

## Testing
- Unit tests: Jest + React Testing Library (recommended)
- Run tests per package: `cd packages/button && npm test`
- CI should run tests across all packages: `npm run test:all`

## Publishing
Recommended workflows:
- Changesets: Create changelog & release PRs using `@changesets/cli`
- Lerna: `lerna publish` (if used)
- Manual publish per package:
    ```
    cd packages/button
    npm publish --access public
    ```
Ensure package.json has correct `name`, `version`, `files`, and `publishConfig`.

## Versioning
- Use semantic versioning. Prefer automated changelog (changesets) to generate releases per package.

## Contributing
- Fork, create a feature branch, add tests, update package README and changelog entry.
- Run lint and tests before submitting a PR.
- Follow the component API and styling conventions used across the repo.

## Package README template
Add or update `packages/<package-name>/README.md` with:
- Purpose and short description
- Installation snippet
- Usage snippet with props and examples
- Props table or link to storybook/docs
- Accessibility notes
- Migration notes (if any)
- Changelog or changeset link

## CI / CD
- Build and test all packages on PRs.
- Publish only from main/release branch with CI job that handles authentication and runs the publish tool.

## License
Specify a license in the root and in each package (e.g., MIT). See `LICENSE` at repo root.

---

Update this README to reflect the real package names, APIs and workspace tooling used in your repo. Each package should include its own README with component-specific examples and API docs.