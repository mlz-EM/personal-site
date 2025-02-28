/* eslint-disable react/jsx-closing-tag-location */
import React from 'react';

import LandingMain from '../layouts/LandingMain';
import Blurb from '../components/Blurb';

const Home = () => (
  <LandingMain
    description="Kevin Mao's personal website."
    fullPage
    typingDone
  >
    <section id="landing">
      <div className="center">
        <h2>Hi there. I&apos;m Kevin Mao.</h2>
        <Blurb />
      </div>
    </section>
  </LandingMain>);

export default Home;
