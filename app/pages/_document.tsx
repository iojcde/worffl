import React from 'react'
import { Document, Html, DocumentHead, Main, BlitzScript } from 'blitz'

class MyDocument extends Document {
  render(): JSX.Element {
    return (
      <Html lang="kr" className="transition duration-200">
        <link href="https://rsms.me/inter/inter.css" rel="preload" as="style" />
        <DocumentHead />
        <body>
          <Main />
          <BlitzScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
