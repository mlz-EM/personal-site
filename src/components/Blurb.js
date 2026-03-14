import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import data from '../data/contact';

const Blurb = () => (
  <section id="blurb">
    <div className="container">
      <div className="row blurb-row">
        <div className="col-md-8 center blurb-icon-col">
          <Link to="/home" className="logo" aria-label="Go to home page">
            <img
              src={`${process.env.PUBLIC_URL}/images/icon.png`}
              alt="Menglin Zhu portrait"
              className="blurb-image home-logo-image"
              loading="lazy"
              decoding="async"
            />
          </Link>
        </div>

        <div className="col-md-4 blurb-copy-col">
          <section className="blurb">
            <p className="blurb-copy">
              I am an electron microscopist motivated by atomic-scale secrets.
              After earning my Ph.D. from &nbsp;
              <a href="https://mse.osu.edu/jinwoo-hwang-stem-group" target="_blank" rel="noopener noreferrer">Ohio State University</a>,
              I now work at &nbsp;
              <a href="https://lebeau.mit.edu/the-group" target="_blank" rel="noopener noreferrer">Massachusetts Institute of Technology</a>&nbsp;
              as a postdoctoral researcher.
            </p>

            <p className="blurb-copy-secondary">
              Learn more about me and my research with the following links and my website!
            </p>
          </section>

          <section id="footer">
            <ul className="icons">
              {data.map((s) => (
                <li key={s.label}>
                  <a href={s.link} target="_blank" rel="noopener noreferrer" aria-label={s.label}>
                    <FontAwesomeIcon icon={s.icon} size="lg" />
                  </a>
                </li>
              ))}
            </ul>
          </section>
        </div>
      </div>
    </div>
  </section>
);

export default Blurb;
