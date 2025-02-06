import React from 'react';
import { Link } from 'react-router-dom';

import Main from '../layouts/Main';

const Index = () => (
  <Main
    description={
      "Menglin Zhu's personal website."
      + ''
    }
  >
    <article className="post" id="index">
      <header>
        <div className="title">
          <h2>
            <Link to="/">A.I.M.</Link>
          </h2>
          <p>
            Advanced Imaging of Materials
          </p>
        </div>
      </header>
      <p>
        {' '}
        Welcome to my website.
      </p>
    </article>
  </Main>
);

export default Index;
