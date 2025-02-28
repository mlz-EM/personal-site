import React from 'react';
import { Link } from 'react-router-dom';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import data from '../data/contact';

const Blurb = () => (
  <>
    <section id="blurb">
      <div className="container">
        <div className="row" style={{ maxWidth: '50em' }}>
          <div className="col-md-8 center">
            <Link to="/home" className="logo">
              <img src={`${process.env.PUBLIC_URL}/images/me.jpg`} alt="" />
            </Link>
          </div>

          <div className="col-md-4" style={{ padding: '1em' }}>
            <header>
              <p>
                <a href="mailto:imkevinmao@gmail.com">imkevinmao@gmail.com</a>
              </p>
            </header>
            <section className="blurb">
              <p style={{ marginBottom: '1em' }}>
                I am a Software Engineer II at Microsoft, a Columbia Engineering graduate,
                and a Columbia Startup Lab alumnus. At Microsoft, I work on
                Azure Event Grid, Microsoft&apos;s premier pub/sub messaging service.
              </p>
              <p>
                I have industry experience in backend and cloud engineering but I love
                tinkering and building, so I&apos;ve accrued various experiences from
                fullstack engineering to applied machine learning through various
                projects and ventures!
              </p>
              <ul className="actions">
                <li>
                  <Link to="/projects" className="button">
                    Learn More
                  </Link>
                </li>
              </ul>
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
