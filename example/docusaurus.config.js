module.exports = require('@strv/docs').docs(
  /** @type import("@strv/docs/lib/index").STRVConfig */
  ({
    title: 'Example Project',
    tagline: 'The example project documentation website.',

    // Where the application is deployed at.
    url: 'https://some-url.com/',
    baseUrl: '/some-sub-path/',

    // Deployment configuration
    organizationName: 'strvcom',
    projectName: 'strv-docs-example',
    deploymentBranch: 'gh-pages', // if applied

    // Optionally disable some of the automatic generated docs.
    // customFields: {
    //   strv: {
    //     pages: false,
    //     docs: false,
    //     adr: false,
    //     components: false,
    //     github: false,
    //   },
    // },

    staticDirectories: ['docs/static'],

    themeConfig: {
      navbar: {
        title: 'Example Project Docs',
        logo: {
          alt: 'Home',
          src: 'logo.png',
          href: '/',
        },
      },

      footer: {
        style: 'dark',
        links: [
          {
            title: 'Links',
            items: [
              { label: 'Docs', to: '/docs' },
              { label: 'Hosting', to: 'https://url-to-the-deployed-application.com' },
              { label: 'strv.com', href: 'https://www.strv.com' },
            ],
          },
        ],
      },
    },
  })
)
