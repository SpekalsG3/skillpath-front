import React from 'react'
import Document, { Html, Head, Main, NextScript } from 'next/document'

import Metrics from 'components/app/metrics'

export default class MyDocument extends Document {
  static async getInitialProps (ctx) {
    const initialProps = await Document.getInitialProps(ctx)
    return { ...initialProps }
  }

  render () {
    return (
      <Html lang="en">
        <Head />
        <body>
          <Main />
          <NextScript />
          <Metrics />
        </body>
      </Html>
    )
  }
}
