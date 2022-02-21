import { DocsVersionProvider } from '@docusaurus/theme-common'
import DocCardList from '@theme/DocCardList'
import Layout from '@theme/Layout'
import React from 'react'

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

const Homepage: React.FC = () => (
  <Layout title="Welcome">
    <div className="container container--fluid margin-vert--lg">
      <div className="row mdxPageWrapper_node_modules-@docusaurus-theme-classic-lib-next-theme-MDXPage-styles-module">
        <div className="col">
          <div className="theme-doc-markdown markdown">
            <h1>Welcome</h1>

            <p>This is the entrypoint for the STRV Website's documentation.</p>

            <div className="margin-top--lg">
              {/* @ts-ignore */}
              <DocsVersionProvider version={{ docs }}>
                <DocCardList
                  items={Object.entries(docs).map(([id, item]) => ({
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

export default Homepage
