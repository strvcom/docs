# @strv/docs

> Built with ❤️ at [STRV](https://www.strv.com/)

An opinionated Docusaurus setup by @strvcom, used to help document products.

## Introduction

This library is a pre-configured Docusarus setup generator, originally used to create the [documentation](https://strvcom.github.io/strv-web/) for the STRV Website. It is composed of a set of defaults that aim at simplifying and standardizing the process of documenting projects – inside, and possibly beyond STRV.

If used to the fullest, this setup includes:

- An index homepage
- A general documentation builder (getting started, contributing, etc)
- A components documentation (architecture, codebase, etc)
- A section for ADRs (for architectural decision records)
- A client-side search system for the above
- Navbar links for the above
- A code-fragment rehype plugin

All of these are opt-outs, meaning they can easily be disabled through configuration, but will be on by default.

In the end, `@strv/docs` main output is a [Docusaurus config](https://docusaurus.io/docs/next/configuration), and further configurations are possible and expected for each project's specific needs.

## Setup

### 1. Install the library:

```
yarn add --dev @strv/docs
```

### 2. Setup `docusaurus.config.js`:

Create a `docusaurus.config.js` file on the root folder. This is a minimal example:

```js docusaurus.config.js
module.exports = require('@strv/docs').docs({
  title: 'Example Project',
  url: 'https://docs-website.com/',
  baseUrl: '/',
})
```

> For a more complete example, check the [example project's configuration](./example/docusaurus.config.js).

### 3. Add docs scripts (optional):

Add Docusaurus building scripts to `package.json`:

```json
{
  "scripts": {
    "docs:start": "docusaurus start -p 8001",
    "docs:build": "docusaurus build --out-dir build-docs",
    "docs:clear": "docusaurus clear",
    "docs:serve": "docusaurus serve -p 8001 --dir build-docs"
  }
}
```

## Configuration

By default, `@strv/docs` will try to guess which features you want to enable by checking the presence of some files in your project. Alternatively, these features can be turn-off manually at the `docusaurus.config.js`:

```js
module.exports = require('@strv/docs').docs({
  customFields: {
    strv: {
      homepage: false, // disable the homepage index
      pages: false, // disable pages plugin
      docs: false, // disable general docs, found at /docs/general
      adr: false, // disable adr docs, found ar /docs/adr
      components: false, // disable components docs, spread across /src files
      changelog: false, // disable Changelog link adding
      github: false, // disable GitHub links
    },
  },
})
```

For some configuration above, no extra effort is needed. Some of them, however, require that you start creating docs in specific locations. Furthermore, the doc generating modules – `docs`, `adr`, and `component``- will use automated sidebars, which can be overriden by placing a sidebar file on specific locations:

| Module | Description | Watched files | Custom sidebar |
| ------ | ----------- | --------- | -------------- |
| Pages | Add isolated React or MDX pages. **You should add these pages to navbar or other links to get access to them**.  | `./docs/pages/**/*.(md\|mdx\|js\|jsx\|ts\|tsx)` |  |
| General | Meant for general docs, not related to application logic  | `./docs/general/**/*.(md\|mdx)` | `./docs/general/sidebar.js` |
| ADR | Meant for architectural decision records | `./docs/adr/**/*.(md\|mdx)` | `./docs/adr/sidebar.js` |
| Components | Meant for documenting current codebase components | `./src/**/*.(md\|mdx)` | `./docs/components-sidebar.js` |

### Custom components source path

In case you want the components documentation to watch a different directory than `/src`, you can configure it in the `docusaurus.config.js` like so:

```js
module.exports = require('@strv/docs').docs({
  customFields: {
    strv: {
      components: 'source', // would look for doc files under ./source/ dir
    },
  },
})
```

> Be careful not to set a path that overlaps any other documentation kinds.
