/* eslint-disable import/no-default-export */
import type { Config, PluginModule } from '@docusaurus/types'
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

import homepage from './plugins/homepage'
import { codeFragment } from './remark-plugins/code-fragment'
import { sidebarItemsGenerator } from './sidebarItemsGenerator'

type STRVConfig = Config & {
  customFields?: {
    strv?: {
      homepage?: boolean
      pages?: boolean
      docs?: boolean
      adr?: boolean
      components?: boolean | string
      changelog?: boolean
      github?: boolean
    }
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
        docsRouteBasePath: '/docs',
        docsDir: 'docs/general',
        indexPages: true,
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
     * Checks if we should install the homepage plugin.
     */
    homepage: (config: SafeConfig) => config.customFields?.strv?.homepage !== false,

    /**
     * Checks if we should install the pages plugin.
     */
    pages: (config: SafeConfig) =>
      config.customFields?.strv?.pages !== false && fs.existsSync(projectPath('./docs/pages')),

    /**
     * Checks if we should install the general docs plugin.
     */
    docs: (config: SafeConfig) =>
      config.customFields?.strv?.docs !== false && fs.existsSync(projectPath('./docs/general')),

    /**
     * Checks if we should install the adr plugin.
     */
    adr: (config: SafeConfig) =>
      config.customFields?.strv?.adr !== false && fs.existsSync(projectPath('./docs/adr')),

    /**
     * Checks if we should install the components plugin.
     */
    components: (config: SafeConfig) => config.customFields?.strv?.components !== false,

    /**
     * Checks if we should install the changelog plugin.
     */
    changelog: (config: SafeConfig) =>
      config.customFields?.strv?.changelog !== false &&
      fs.existsSync(projectPath('./docs/pages/changelog.mdx')),

    /**
     * Checks if we should install GitHub links.
     */
    github: (config: SafeConfig) =>
      config.customFields?.strv?.github !== false &&
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
    homepage: (config: SafeConfig) => {
      config.plugins.push([homepage as PluginModule, {}])
    },

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
          sidebarPath: [
            projectPath('./docs/general/sidebar.js'),
            require.resolve('../static/general-sidebar.js'),
          ].find((sidebar) => fs.existsSync(sidebar)),
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
          sidebarPath: [
            projectPath('./docs/adr/sidebar.js'),
            require.resolve('../static/adr-sidebar.js'),
          ].find((sidebar) => fs.existsSync(sidebar)),
          ...plugins,
        },
      ])

      // @ts-ignore
      config.themeConfig.navbar.items.push({ to: '/adr', label: 'ADR', position: 'left' })
    },

    components: (config: SafeConfig) => {
      const src =
        typeof config.customFields?.strv?.components === 'string'
          ? config.customFields?.strv?.components
          : 'src'

      config.plugins.push([
        '@docusaurus/plugin-content-docs',
        /** @type {import('@docusaurus/plugin-content-docs').PluginOptions} */
        {
          id: 'components',
          path: src,
          routeBasePath: '/components',
          sidebarPath: [
            projectPath('./docs/components-sidebar.js'),
            require.resolve('../static/components-sidebar.json'),
          ].find((sidebar) => fs.existsSync(sidebar)),
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

    changelog: (config: SafeConfig) => {
      // @ts-ignore
      config.themeConfig.navbar.items.push({
        to: '/changelog',
        label: 'Changelog',
        position: 'left',
      })
    },
  },

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
    homepage: has.enabled.homepage(config),
    pages: has.enabled.pages(config),
    docs: has.enabled.docs(config),
    adr: has.enabled.adr(config),
    changelog: has.enabled.changelog(config),
    components: has.enabled.components(config),
  }

  // Install classic preset, if not installed already.
  if (shouldInstall.preset) install.preset.classic(config)

  // Install homepage, if enabled.
  if (shouldInstall.homepage) install.plugins.homepage(config)

  // Install pages, if enabled.
  if (shouldInstall.pages) install.plugins.pages(config)

  // Install general docs, if enabled.
  if (shouldInstall.docs) install.plugins.docs(config)

  // Install components docs, if enabled.
  if (shouldInstall.components) install.plugins.components(config)

  // Install adr docs, if enabled.
  if (shouldInstall.adr) install.plugins.adr(config)

  // Install changelog page, if enabled.
  if (shouldInstall.changelog) install.plugins.changelog(config)

  return config
}

export type { STRVConfig }

export { docs }
