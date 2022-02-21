/* eslint-disable import/no-default-export */
import type { Config } from '@docusaurus/types'
import merge from 'deepmerge'
import fs from 'fs'
import path from 'path'
// import classic from '@docusaurus/preset-classic'
/// @ts-ignore no need for typing here
import darkTheme from 'prism-react-renderer/themes/dracula'
/// @ts-ignore no need for typing here
import theme from 'prism-react-renderer/themes/github'
import type * as ts from 'ts-toolbelt'
import type { PackageJson } from 'type-fest'

import { codeFragment } from './remark-plugins/code-fragment'
import { sidebarItemsGenerator } from './sidebarItemsGenerator'

type STRVConfig = Config & {
  strv?: {
    pages?: boolean
    docs?: boolean
    adr?: boolean
    components?: boolean
    github?: boolean
  }
}

type SafeConfig = Omit<STRVConfig, 'presets' | 'plugins'> &
  ts.Object.Required<STRVConfig, 'presets' | 'plugins'>

const plugins = {
  remarkPlugins: [require('mdx-mermaid')],
  beforeDefaultRemarkPlugins: [codeFragment],
}

/**
 * Resolves a path relative to the project's root.
 */
const projectPath = (relative: string) => path.resolve(process.cwd(), relative)

/**
 * Commonly used paths.
 */
const paths = {
  package: projectPath('./package.json'),
}

/**
 * Package JSON of consuming project.
 */
const pack: PackageJson | null = fs.existsSync(paths.package) ? require(paths.package) : null

const defaults: Partial<Config> = {
  staticDirectories: ['docs/static'],
  onBrokenLinks: 'throw',
  onBrokenMarkdownLinks: 'warn',

  themes: [
    [
      require.resolve('@easyops-cn/docusaurus-search-local'),
      {
        docsRouteBasePath: '/',
        ignoreFiles: /changelog/u,
      },
    ],
  ],

  /** @type {import('@docusaurus/preset-classic').ThemeConfig} */
  themeConfig: {
    colorMode: { respectPrefersColorScheme: false },
    navbar: { items: [] }, // initiate
    prism: { theme, darkTheme },
  },

  presets: [], // initiate
  plugins: [], // initiate
}

const has = {
  /**
   * Check if a config contains the classic preset.
   */
  classicPreset: (config: SafeConfig) =>
    Boolean(
      config.presets.find((preset) =>
        typeof preset === 'string' ? preset === 'classic' : preset[0] === 'classic'
      )
    ),

  enabled: {
    /**
     * Checks if we should install the pages plugin.
     */
    pages: (config: SafeConfig) =>
      config.strv?.pages !== false && fs.existsSync(projectPath('./docs/pages')),

    /**
     * Checks if we should install the general docs plugin.
     */
    docs: (config: SafeConfig) =>
      config.strv?.docs !== false && fs.existsSync(projectPath('./docs/general')),

    /**
     * Checks if we should install the adr plugin.
     */
    adr: (config: SafeConfig) =>
      config.strv?.adr !== false && fs.existsSync(projectPath('./docs/adr')),

    /**
     * Checks if we should install the components plugin.
     */
    components: (config: SafeConfig) => config.strv?.components !== false,

    /**
     * Checks if we should install GitHub links.
     */
    github: (config: SafeConfig) =>
      config.strv?.github !== false &&
      typeof pack?.repository === 'string' &&
      pack.repository.includes('github'),
  },
}

const install = {
  /**
   * Install the basis classic preset.
   */
  preset: {
    classic: (config: SafeConfig) =>
      config.presets.push([
        'classic',
        {
          docs: false,
          pages: false,
          blog: false,
          theme: {
            customCss: [require.resolve('../static/strv-docs.css')],
          },
        },
      ]),
  },

  /**
   * Installs the plugin to server docs/pages content.
   */
  plugins: {
    pages: (config: SafeConfig) => {
      config.plugins.push([
        '@docusaurus/plugin-content-pages',
        {
          id: 'pages',
          path: 'docs/pages',
          routeBasePath: '/',
          ...plugins,
        },
      ])
    },

    docs: (config: SafeConfig) => {
      config.plugins.push([
        '@docusaurus/plugin-content-docs',
        /** @type {import('@docusaurus/plugin-content-docs').PluginOptions} */
        {
          id: 'documentation',
          path: 'docs/general',
          routeBasePath: '/docs',
          sidebarPath: projectPath('./docs/general/sidebars.js'),
          ...plugins,
        },
      ])

      // @ts-ignore
      config.themeConfig.navbar.items.push({ to: '/docs', label: 'Docs', position: 'left' })
    },

    adr: (config: SafeConfig) => {
      config.plugins.push([
        '@docusaurus/plugin-content-docs',
        /** @type {import('@docusaurus/plugin-content-docs').PluginOptions} */
        {
          id: 'adr',
          path: 'docs/adr',
          routeBasePath: '/adr',
          sidebarPath: projectPath('./docs/adr/sidebars.js'),
          ...plugins,
        },
      ])

      // @ts-ignore
      config.themeConfig.navbar.items.push({ to: '/adr', label: 'ADR', position: 'left' })
    },

    components: (config: SafeConfig) => {
      config.plugins.push([
        '@docusaurus/plugin-content-docs',
        /** @type {import('@docusaurus/plugin-content-docs').PluginOptions} */
        {
          id: 'components',
          path: 'src',
          routeBasePath: '/components',
          sidebarPath: require.resolve('../static/components-sidebar.json'),
          sidebarItemsGenerator,
          ...plugins,
        },
      ])

      // @ts-ignore
      config.themeConfig.navbar.items.push({
        to: '/components',
        label: 'Components',
        position: 'left',
      })
    },
  },

  /**
   * Installs the GitHub link on the navbar.
   */
  github: (config: SafeConfig) => {
    // @ts-ignore
    config.themeConfig.navbar.items.push({
      href: pack?.repository as string,
      label: 'GitHub',
      position: 'right',
    })
  },
}

/**
 * STRV opinionated Docusaurus config creator.
 */
const docs = (overrides: STRVConfig) => {
  const config = merge(defaults, overrides) as SafeConfig

  const shouldInstall = {
    preset: !has.classicPreset(config),
    pages: has.enabled.pages(config),
    docs: has.enabled.docs(config),
    adr: has.enabled.adr(config),
    components: has.enabled.components(config),
  }

  // Install classic preset, if not installed already.
  if (shouldInstall.preset) install.preset.classic(config)

  // Install pages, if enabled.
  if (shouldInstall.pages) install.plugins.pages(config)

  // Install general docs, if enabled.
  if (shouldInstall.docs) install.plugins.docs(config)

  // Install adr docs, if enabled.
  if (shouldInstall.adr) install.plugins.adr(config)

  // Install components docs, if enabled.
  if (shouldInstall.components) install.plugins.components(config)

  // process.exit(0)

  return config
}

export type { STRVConfig }

export { docs }
