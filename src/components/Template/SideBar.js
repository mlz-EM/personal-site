import React from 'react';
import { Link } from 'react-router-dom';

import ContactIconsVertical from '../ContactIconsVertical';

const { PUBLIC_URL } = process.env; // set automatically from package.json:homepage

const SideBar = () => (
  <section id="sidebar">
    <section id="intro">
      <Link to="/home" className="logo">
        <img src={`${PUBLIC_URL}/images/me.jpg`} alt="" style={{ width: '200px', height: '200px' }} />
      </Link>
      <header>
        <h2>Menglin Zhu</h2>
      </header>
    </section>

    <section id="footer">
      <ContactIconsVertical />
      <p className="copyright">
        &copy; Menglin Zhu@mlz-em.
      </p>
    </section>
  </section>
);

export default SideBar;
