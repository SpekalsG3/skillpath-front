import React from 'react';

import 'styles/globals.scss';
import 'styles/variables.scss';

import { Provider } from 'react-redux';
import Head from 'next/head';

import { reduxCreateStore } from 'store';

export default function App ({ Component, pageProps, initialState }) {
  const [store] = React.useState(reduxCreateStore(initialState));

  return (
    <Provider store={store}>
      <Head>
        <title>SkillPath</title>
        <link rel="apple-touch-icon" sizes="180x180" href="/favicon.ico" />
        <link rel="icon" type="image/png" sizes="16x16" href="/favicon.ico" />
        <link rel="manifest" href="/site.webmanifest" />
        <meta name="msapplication-TileColor" content="#da532c" />
        <meta name="theme-color" content="#ffffff" />
        <meta name="viewport" content="width=device-width, initial-scale=1, user-scalable=no" />
      </Head>
      <Component {...pageProps} />
    </Provider>
  );
}

App.getInitialProps = async ({ ctx }) => {
  const store = reduxCreateStore({});
  ctx.store = store;
  return { initialState: store.getState() };
};
