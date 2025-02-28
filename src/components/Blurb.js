import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import data from '../data/contact';

const Blurb = () => (
  <>
    <section id="blurb">
      <div className="container">
        <div className="row" style={{ maxWidth: '40em' }}>
          <div className="col-md-8 center">
            <Link to="/home" className="logo">
              <img src={`${process.env.PUBLIC_URL}/images/me.jpg`} alt="" style={{ width: '200px', height: '200px' }} />
            </Link>
          </div>

          <div className="col-md-4" style={{ padding: '1em' }}>
            <section className="blurb">
              <p style={{ marginBottom: '1em', marginTop: '1em' }}>
                I am an electron microscopist motivated by atomic-scale secrets.
                After earning my Ph.D. from &nbsp;
                <a href="https://mse.osu.edu/jinwoo-hwang-stem-group" target="_blank" rel="noopener noreferrer">Ohio State University</a>,
                I now work at &nbsp;
                <a href="https://lebeau.mit.edu/the-group/Massachusetts" target="_blank" rel="noopener noreferrer">Massachusetts Institute of Technology</a>&nbsp;
                as a postdoctoral researcher.
              </p>

              <p style={{ marginBottom: '1em' }}>
                Learn more about me and my research with the following links and my website!
              </p>
            </section>

            <section id="footer">
              <ul className="icons">
                {data.map((s) => (
                  <li key={s.label}>
                    <a href={s.link} target="_blank" rel="noopener noreferrer">
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
  </>
);

export default Blurb;
