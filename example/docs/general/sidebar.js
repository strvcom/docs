// @ts-check

/** @type {import('@docusaurus/plugin-content-docs').SidebarsConfig} */
const sidebars = {
  main: [
    'introduction',
    {
      type: 'category',
      label: 'Getting Started',
      collapsed: false,
      collapsible: false,
      link: {
        type: 'generated-index',
        title: 'Getting Started',
        description: 'Follow these guides to get up & running with local development.',
        slug: '/getting-started',
      },
      items: [{ type: 'autogenerated', dirName: 'getting-started' }],
    },
    'contributing',
    'deployment',
  ],
}

module.exports = sidebars