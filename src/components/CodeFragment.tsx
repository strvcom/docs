import CodeBlock from '@theme/CodeBlock'
import React from 'react'

// @ts-ignore
import { Modal } from './Modal'

interface IProps {
  fragment: {
    language: string
    filepath: string
    content: string
  }
  inline?: boolean
  label?: string
}

/**
 * Renders a code snippet or a code link based on a fragment.
 */
const CodeFragment: React.FC<IProps> = ({
  fragment: { language, filepath, content },
  inline,
  label,
}) => {
  const [isOpen, setIsOpen] = React.useState(false)

  const code = (
    <CodeBlock className={`language-${language}`} title={inline ? undefined : filepath}>
      {content}
    </CodeBlock>
  )

  return inline ? (
    <>
      <a
        href="#code-fragment"
        onClick={(e) => {
          e.preventDefault()
          setIsOpen(true)
        }}
      >
        {label ?? filepath}
      </a>
      <Modal
        title={filepath}
        isOpen={isOpen}
        onRequestClose={() => void setIsOpen(false)}
        onAfterOpen={() => (document.body.style.overflow = 'hidden')}
        onAfterClose={() => (document.body.style.overflow = 'visible')}
      >
        {code}
      </Modal>
    </>
  ) : (
    code
  )
}

CodeFragment.defaultProps = {
  inline: false,
  label: undefined,
}

export { CodeFragment }
