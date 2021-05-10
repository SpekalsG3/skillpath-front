import React from 'react';

import useHeader from 'utils/use-header';

import Header from 'components/ui/header';
import Map from './components/map';
import Footer from 'components/ui/footer';

export default function IndexPage () {
  const head = useHeader(
    'Pick the best skill',
    'Pick skill which suits your interests and also in demand',
  );

  return (
    <div>
      {head}
      <Header/>
      <Map/>
      <Footer/>
    </div>
  );
}
