import React from "react"
import { Document, Html, DocumentHead, Main, BlitzScript, DocumentContext } from "blitz"
import { CssBaseline } from "@geist-ui/react"

class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const initialProps = await Document.getInitialProps(ctx)
    const styles = CssBaseline.flush()

    return {
      ...initialProps,
      styles: (
        <>
          {initialProps.styles}
          {styles}
        </>
      ),
    }
  }

  render() {
    return (
      <Html lang="kr">
        <DocumentHead />
        <body>
          <script
            dangerouslySetInnerHTML={{
              __html: `
            (function(){
              if (!window.localStorage) return;
              if (window.localStorage.getItem('theme') === 'dark') {
                document.documentElement.style.background = '#000';
                document.body.style.background = '#000';
              } else {
                document.documentElement.style.background = '#fff';
                document.body.style.background = '#fff';
              }
            })()`,
            }}
          />
          <Main />
          <BlitzScript />
        </body>
      </Html>
    )
  }
}

export default MyDocument
