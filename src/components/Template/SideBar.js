import React from 'react';
import { Link } from 'react-router-dom';

import ContactIcons from '../Contact/ContactIcons';

const { PUBLIC_URL } = process.env; // set automatically from package.json:homepage

const SideBar = () => (
  <section id="sidebar">
    <section id="intro">
      <Link to="/" className="logo">
        <img src={`${PUBLIC_URL}/images/me.jpg`} alt="" />
      </Link>
      <header>
        <h2>Menglin Zhu</h2>
        <p>
          <a href="mailto:mlz.eMicroscopy@gmail.com">mlz.eMicroscopy@gmail.com</a>
        </p>
      </header>
    </section>

    <section className="blurb">
      <h2>About</h2>
      <p>
        Hi, I&apos;m Menglin Zhu.
      </p>
      <ul className="actions">
        <li>
          <a href={`${process.env.PUBLIC_URL}/assets/CV/CV.pdf`} className="button" download>
            Download C.V.
          </a>
        </li>
      </ul>

    </section>

    <section id="footer">
      <ContactIcons />
      <p className="copyright">
        <br />
        &copy; Menglin Zhu <Link to="/">mlz-em.com</Link>.
      </p>
    </section>
  </section>
);

export default SideBar;
