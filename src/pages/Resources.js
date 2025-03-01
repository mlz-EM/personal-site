import React from 'react';
// import { Link } from 'react-router-dom';

import Main from '../layouts/Main';

import Cell from '../components/Projects/Cell';
import data from '../data/projects';

const Resources = () => (
  <Main title="Resources" description="Useful Resources.">
    <article className="post" id="resources">
      <header>
        <div className="title">
          <h2>
            Resources
          </h2>
        </div>
      </header>
      {data.map((project) => (
        <Cell data={project} key={project.title} />
      ))}
    </article>
  </Main>
);

export default Resources;
