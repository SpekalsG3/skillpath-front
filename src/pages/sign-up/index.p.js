import React from 'react';

import useHeader from 'utils/use-header';

import Header from 'components/ui/header';
import Footer from 'components/ui/footer';

import { Content } from './components/content';

export default function SignInPage () {
  const head = useHeader(
    'Sign in to view skills',
    'Sign in so you can progress on your own path',
  );

  return (
    <>
      {head}
      <Header/>
      <Content/>
      <Footer/>
    </>
  );
}
