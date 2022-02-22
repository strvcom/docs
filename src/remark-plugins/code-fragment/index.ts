// @ts-check

import fs from 'fs'
import path from 'path'
import type { Plugin as UnifiedPlugin } from 'unified'
import visit from 'unist-util-visit'

import { extract, stringify } from './utils'

const importCodeFragmentNode = {
  type: 'import',
  value: "import { CodeFragment } from '@strv/docs/components'",
}

const altRegex = /@code-fragment(?<inline>-inline(?:\((?<label>.+)\))?)?:?(?<fragmentName>.+)?/iu

/**
 * Unist plugin declaration to inject CodeFragment, and append at place of use.
 */
const codeFragment: UnifiedPlugin = () => (ast, file) => {
  // Inject CodeFragment import in any AST to make it "globally" available.
  // @ts-ignore
  ast.children = [importCodeFragmentNode, ...ast.children]

  visit(ast, (node, index, parentNode) => {
    if (
      file.path &&
      node?.type === 'image' &&
      index !== null &&
      parentNode &&
      'children' in parentNode
    ) {
      const { alt, url } = node as unknown as { alt: string; url: string }

      const match = alt ? altRegex.exec(alt) : null

      if (match) {
        const label = match.groups?.label ?? url
        const target = path.resolve(path.dirname(file.path), url)
        const source = fs.readFileSync(target, 'utf-8')
        const inline = Boolean(match.groups?.inline)
        const fragment = stringify(
          extract(source, { fragment: match.groups?.fragmentName }, target)
        )

        parentNode.children[parentNode.children.indexOf(node)] = {
          type: 'jsx',
          // @ts-ignore
          value: `<CodeFragment fragment={${fragment}} inline={${inline}} label={"${label}"} />`,
        }
      }
    }
  })
}

export { codeFragment }
