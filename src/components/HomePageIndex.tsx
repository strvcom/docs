import { DocsVersionProvider } from '@docusaurus/theme-common'
import DocCardList from '@theme/DocCardList'
import Layout from '@theme/Layout'
import React from 'react'

import type { STRVConfig } from '../index'

const docs = {
  docs: {
    label: 'Documentation',
    href: '/docs',
    description: 'General onboarding documentation, and codebase structure',
  },

  components: {
    label: 'Components',
    href: '/components',
    description: 'Specific documentation of application components',
  },

  adr: {
    label: 'Architecture Decisions',
    href: '/adr',
    description: 'Index of Architecture Decision Records',
  },

  changelog: {
    label: 'Changelog',
    href: '/changelog',
    description: 'Released versions with described changes',
  },
}

interface IProps {
  data: {
    title: string
    strv: NonNullable<NonNullable<STRVConfig['customFields']>['strv']>
  }
}

const HomePageIndex: React.FC<IProps> = ({ data }) => (
  <Layout title="Welcome">
    <div className="container container--fluid margin-vert--lg">
      <div className="row mdxPageWrapper_node_modules-@docusaurus-theme-classic-lib-next-theme-MDXPage-styles-module">
        <div className="col">
          <div className="theme-doc-markdown markdown">
            <h1>Welcome</h1>

            <p>This is the entrypoint for the {data.title}&apos;s documentation.</p>

            <div className="margin-top--lg">
              {/* @ts-ignore */}
              <DocsVersionProvider version={{ docs }}>
                <DocCardList
                  items={Object.entries(docs)
                    .filter(([id]) => data.strv[id as keyof typeof data.strv] !== false)
                    .map(([id, item]) => ({
                      ...item,
                      type: 'link',
                      docId: id,
                    }))}
                />
              </DocsVersionProvider>
            </div>
          </div>
        </div>
      </div>
    </div>
  </Layout>
)

export default HomePageIndex
