/* eslint-disable react/jsx-closing-tag-location */
import React, { useState } from 'react';

import LandingMain from '../layouts/LandingMain';
import Typewriter from '../components/Typewriter';
import Blurb from '../components/Blurb';

const Index = () => {
  if (window.innerWidth < 1281) {
    return (
      <LandingMain
        description="Menglin Zhu's personal website"
        typingDone
      >
        <section id="landing">
          <div className="center">
            <h2>Welcome to Menglin Zhu&apos;s personal website.</h2>
            <Blurb />
          </div>
        </section>
      </LandingMain>);
  }

  const [typingDone, setTypingDone] = useState(false);
  const [visible, setVisible] = useState('invisible');

  return (
    <LandingMain
      description="Menglin Zhu's personal website"
      typingDone={typingDone}
    >
      <section id="landing">
        <div className="center">
          <Typewriter text="Welcome to Menglin Zhu&apos;s personal website." delay={35} onTypingDone={() => { setTypingDone(true); setVisible('fadeIn'); }} />
          <div className={visible}>
            <Blurb />
          </div>
        </div>
      </section>
    </LandingMain>);
};

export default Index;
