import React from 'react';

import useHeader from 'utils/use-header';

import Header from 'components/ui/header';
import Footer from 'components/ui/footer';

import { Content } from './components/content';

export default function SignUpPage () {
  const head = useHeader(
    'Sign up to pick skills',
    'Sign up so you can create your own path',
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
