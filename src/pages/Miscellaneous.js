import React from 'react';
// import { Link } from 'react-router-dom';

import Main from '../layouts/Main';

import Cell from '../components/Projects/Cell';
import data from '../data/projects';

const Miscellaneous = () => (
  <Main title="Miscellaneous" description="Learn about Menglin Zhu's Miscellaneous.">
    <article className="post" id="projects">
      <header>
        <div className="title">
          <h2>
            Miscellaneous
          </h2>
        </div>
      </header>
      {data.map((project) => (
        <Cell data={project} key={project.title} />
      ))}
    </article>
  </Main>
);

export default Miscellaneous;
