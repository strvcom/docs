import type {
  SidebarItemsGeneratorOption,
  SidebarItem,
  SidebarItemCategoryLink,
} from '@docusaurus/plugin-content-docs/src/sidebars/types'

/**
 * Custom SidebarItemsGenerator
 *
 * 1. Configures the sidebar items to use the label of their index docs, where applicable.
 * 2. Fixes category leaves (empty categories)
 * 3. Sorts deep items based on sidebar_position
 */
const sidebarItemsGenerator: SidebarItemsGeneratorOption = async (context) => {
  const docs = Object.fromEntries(context.docs.map((doc) => [doc.id, doc]))

  /**
   * @typedef {import('@docusaurus/plugin-content-docs/src/sidebars/types').SidebarItem} SidebarItem
   * @typedef {import('@docusaurus/plugin-content-docs/src/sidebars/types').SidebarItemCategoryLink} SidebarItemCategoryLink
   */

  /**
   * Finds a position of a sidebar item.
   */
  const getSidebarPosition = (
    item: SidebarItem | SidebarItemCategoryLink | undefined
  ): number | undefined => {
    if (item?.type === 'category') return getSidebarPosition(item.link ? item.link : item.items[0])
    if (item?.type === 'doc') return docs[item.id].sidebarPosition
  }

  /**
   * Recursively processes items to:
   *
   * 1. Unwrap category if it contains only the index doc.
   * 2. Add category labels based on index doc.
   * 3. Ensure sidebar_position is respected for automated trees.
   */
  const processItem = (item: SidebarItem) => {
    if (item.type === 'category') {
      // Fix root
      if (item.items.length === 0 && item.link?.type === 'doc') {
        return item.link
      }

      const index = item.link && 'id' in item.link ? item.link : null
      const indexDoc = index ? context.docs.find((doc) => doc.id === index.id) : null

      if (indexDoc) {
        item.label = indexDoc.frontMatter.sidebar_label ?? indexDoc.frontMatter.title ?? item.label
      }

      // Fix children
      item.items = item.items
        .map(processItem)
        .map((childItem, i) => [childItem, i] as const)
        // Ensure sidebar_position is respected.
        .sort(([a, ai], [b, bi]) => {
          const positions = {
            a: getSidebarPosition(a) ?? ai,
            b: getSidebarPosition(b) ?? bi,
          }

          return positions.a < positions.b ? -1 : 1
        })
        .map(([childItem]) => childItem)
    }

    return item
  }

  const sidebar = await context
    .defaultSidebarItemsGenerator(context)
    .then((items) => items.map(processItem))

  return sidebar
}

export { sidebarItemsGenerator }
