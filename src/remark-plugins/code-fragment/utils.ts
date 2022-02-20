import path from 'path'

/**
 * Get the delimiters for a given fragment name.
 */
const getDelimiters = (fragment: string) => ({
  start: `/// doc-fragment-start:${fragment}`,
  end: `/// doc-fragment-end:${fragment}`,
})

/**
 * Extracts a code fragment from the source file.
 */
const getCodeFragment = (fragment: string, source: string) => {
  const { start, end } = getDelimiters(fragment)

  const matches = [
    ...source.matchAll(new RegExp(`${start}[\r\n]+(?<snippet>.+)[\r\n]+${end}`, 'sug')),
  ]

  if (matches.length === 0) {
    throw new Error(`Could not find code fragment with name "${fragment}"`)
  }

  if (matches.length > 1) {
    throw new Error(`Multiple code fragment found with name "${fragment}"`)
  }

  const match = matches[0]

  // @ts-ignore
  return match.groups.snippet
}

/**
 * Extracts all information for a code-fragment.
 */
const extract = (source: string, options: { fragment?: string }, resourcePath: string) => ({
  content: options.fragment ? getCodeFragment(options.fragment, source) : source,
  filepath: path.relative(process.cwd(), resourcePath).replace(/^src\//u, '~/'),
  language: path.extname(resourcePath).replace('.', ''),
})

interface IFragment {
  content: string
  filepath: string
  language: string
}

/**
 * Stringifies the extracted fragment
 */
const stringify = (fragment: IFragment) =>
  JSON.stringify(fragment)
    .replace(/\u2028/gu, '\\u2028')
    .replace(/\u2029/gu, '\\u2029')

export { stringify, extract }
