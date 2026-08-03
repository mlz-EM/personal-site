/* eslint-disable react/jsx-closing-tag-location */
import React from 'react';

import LandingMain from '../layouts/LandingMain';
import Blurb from '../components/Blurb';
import { getFeaturedPinnedItems } from '../content/api';

const Index = () => {
  const featuredItems = getFeaturedPinnedItems();
  return (
    <LandingMain
      description="Menglin Zhu's personal website"
      typingDone
    >
      <section id="landing">
        <div className="center">
          <h2>Welcome to Menglin Zhu&apos;s personal website.</h2>
          <Blurb featuredItems={featuredItems} />
        </div>
      </section>
    </LandingMain>
  );
};

export default Index;
