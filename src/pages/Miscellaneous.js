import React from 'react';
// import { Link } from 'react-router-dom';
import Main from '../layouts/Main';
import MiniCell from '../components/Template/MiniCell';
import data from '../data/miscellaneous';

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
      {data.map((badge) => (
        <MiniCell
          data={badge}
          key={badge.label}
        />
      ))}
    </article>
  </Main>
);

export default Miscellaneous;
