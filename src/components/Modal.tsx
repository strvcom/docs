/* eslint-disable @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access, react/forbid-dom-props */
import { useColorMode } from '@docusaurus/theme-common'
import React from 'react'
import ReactModal from 'react-modal'
import type { Props as ReactModalProps, Styles as ReactModalStyles } from 'react-modal'

interface Styles {
  modal: ReactModalStyles
  content: React.CSSProperties
  button: React.CSSProperties
}

/**
 * Create styles for
 */
const useStyles = (isDarkTheme: boolean): Styles => ({
  modal: {
    overlay: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center',
      background: isDarkTheme ? 'rgba(0, 0, 0, 0.75)' : 'rgba(255, 255, 255, 0.75)',
    },

    content: {
      position: 'relative',
      inset: 'auto',
      margin: '6rem 2rem 2rem',

      maxWidth: 'calc(100% - 4rem)',
      display: 'flex',
      flexDirection: 'column',
      background: isDarkTheme ? '#18191a' : 'white',
      border: isDarkTheme ? '1px solid #1c1e21' : '1px solid rgb(204, 204, 204)',
    },
  },

  content: {
    overflow: 'auto',
  },

  button: {
    background: 'transparent',
    border: 'none',
    position: 'absolute',
    inset: '1rem 1rem auto auto',
    cursor: 'pointer',
    fontFamily: 'monospace',
    fontSize: '1.5rem',
  },
})

type TProps = ReactModalProps & {
  title?: string
}

/**
 * Opens a modal suited for the Docusaurus environment.
 */
const Modal: React.FC<TProps> = ({ children, title, ...props }) => {
  const styles = useStyles(useColorMode().isDarkTheme)

  return (
    <ReactModal {...props} style={styles.modal}>
      <button type="button" style={styles.button} onClick={props.onRequestClose}>
        x
      </button>
      {title ? <h2>{title}</h2> : null}
      <div style={styles.content}>{children}</div>
    </ReactModal>
  )
}

Modal.defaultProps = {
  title: undefined,
}

export { Modal }
