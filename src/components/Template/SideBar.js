import React from 'react';
import { Link } from 'react-router-dom';

import ContactIcons from '../ContactIcons';

const { PUBLIC_URL } = process.env; // set automatically from package.json:homepage

const SideBar = () => (
  <section id="sidebar">
    <section id="intro">
      <Link to="/home" className="logo">
        <img src={`${PUBLIC_URL}/images/icon.png`} alt="" style={{ width: '200px', height: '200px' }} />
      </Link>
      <header>
        <h2>Menglin Zhu</h2>
      </header>
    </section>

    <section id="footer">
      <ContactIcons />
      <p className="copyright">
        &copy; Menglin Zhu@mlz-em.
      </p>
    </section>
  </section>
);

export default SideBar;
