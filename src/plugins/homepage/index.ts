import type { Plugin as DocusaurusPlugin, LoadContext } from '@docusaurus/types'
import { normalizeUrl } from '@docusaurus/utils'

/**
 * Custom docusaurus content plugin to automate the creation of docs homepage.
 */
const plugin = (context: LoadContext): DocusaurusPlugin => {
  return {
    name: 'docusaurus-plugin-homepage',

    async contentLoaded({ actions }) {
      const data = await actions.createData(
        'homepage.json',
        JSON.stringify({
          title: context.siteConfig.title,
          strv: context.siteConfig.customFields?.strv ?? {},
        })
      )

      actions.addRoute({
        path: normalizeUrl([context.baseUrl, '/']),
        exact: true,
        component: '@strv/docs/components/HomePageIndex',
        modules: {
          data,
        },
      })
    },
  }
}

export default plugin
