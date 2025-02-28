import React from 'react';
import { Link } from 'react-router-dom';

import ContactIcons from '../ContactIcons';

const { PUBLIC_URL } = process.env; // set automatically from package.json:homepage

const SideBar = () => (
  <section id="sidebar">
    <section id="intro">
      <Link to="/home" className="logo">
        <img src={`${PUBLIC_URL}/images/me.jpg`} alt="" />
      </Link>
      <header>
        <h2>Kevin Mao</h2>
        <p>
          <a href="mailto:imkevinmao@gmail.com">imkevinmao@gmail.com</a>
        </p>
      </header>
    </section>

    <section className="blurb">
      <h2>About</h2>
      <p>
        I am a Columbia Engineering graduate, Columbia Startup Lab alumnus, and
        a Software Engineer II at Microsoft, where I work on Azure Event Grid,
        Microsoft&apos;s premier pub/sub messaging service.
      </p>
      <ul className="actions">
        <li>
          <a href={`${process.env.PUBLIC_URL}/kevin-mao.pdf`} target="_blank" rel="noreferrer" className="button"> View Resume </a>
        </li>
      </ul>
    </section>

    <section id="footer">
      <ContactIcons />
      <p className="copyright">
        &copy; Kevin Mao.
      </p>
    </section>
  </section>
);

export default SideBar;
