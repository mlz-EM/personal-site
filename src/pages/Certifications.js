import React from 'react';
import { Link } from 'react-router-dom';

import Main from '../layouts/Main';

import Badge from '../components/Projects/Badge';
import data from '../data/certifications';

const Certifications = () => (
  <Main
    title="Certifications"
    description="Learn about Borislav Grigorov's certifications."
  >
    <article className="post" id="certifications">
      <header>
        <div className="title">
          <h2 data-testid="heading"><Link to="/certifications">Certifications</Link></h2>
        </div>
      </header>
      {data.map((badge) => (
        <Badge
          data={badge}
          key={badge.label}
        />
      ))}
    </article>
  </Main>
);

export default Certifications;
