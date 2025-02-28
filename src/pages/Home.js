/* eslint-disable react/jsx-closing-tag-location */
import React from 'react';

import LandingMain from '../layouts/LandingMain';
import Blurb from '../components/Blurb';

const Home = () => (
  <LandingMain
    description="Menglin Zhu's personal website."
    fullPage
    typingDone
  >
    <section id="landing">
      <div className="center">
        <h2>Welcome to Menglin Zhu&apos;s personal website.</h2>
        <Blurb />
      </div>
    </section>
  </LandingMain>);

export default Home;
