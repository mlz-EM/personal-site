import React from 'react';
import { Link } from 'react-router-dom';

import ContactIcons from '../ContactIcons';
import MapMyVisitors from '../MapMyVisitors';

const { PUBLIC_URL } = process.env; // set automatically from package.json:homepage

const SideBar = () => (
  <section id="sidebar">
    <section id="intro">
      <Link to="/home" className="logo" aria-label="Go to home page">
        <img
          src={`${PUBLIC_URL}/images/icon.png`}
          alt="Menglin Zhu profile"
          className="sidebar-logo-image profile-image-large"
          loading="lazy"
          decoding="async"
        />
      </Link>
      <header>
        <h2>Menglin Zhu</h2>
      </header>
    </section>

    <section id="footer">
      <ContactIcons />
      <MapMyVisitors />
      <p className="copyright">
        &copy; Menglin Zhu@mlz-em.
      </p>
    </section>
  </section>
);

export default SideBar;
