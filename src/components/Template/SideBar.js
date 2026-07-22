import React from 'react';
import { Link } from 'react-router-dom';
import dayjs from 'dayjs';

import ContactIcons from '../ContactIcons';
import MapMyVisitors from '../MapMyVisitors';
import { getFeaturedPinnedItems } from '../../content/api';

const { PUBLIC_URL } = process.env; // set automatically from package.json:homepage

const SideBar = () => {
  const featuredItems = getFeaturedPinnedItems().slice(0, 4);

  return (
    <section id="sidebar">
      <section id="intro">
        <Link to="/home" className="logo" aria-label="Go to home page">
          <img
            src={`${PUBLIC_URL}/images/icon.png`}
            alt="Menglin Zhu profile"
            className="sidebar-logo-image profile-image-large"
            width="200"
            height="200"
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

      {featuredItems.length > 0 ? (
        <section className="sidebar-featured" aria-label="Featured">
          <h3 className="featured-title">Featured</h3>
          <ul className="featured-list">
            {featuredItems.map((item) => (
              <li key={`${item.date}-${item.title}`} className="featured-item">
                <span className="featured-date">{dayjs(item.date).format('YYYY/MM')}</span>
                <a href={item.url} target="_blank" rel="noopener noreferrer">
                  {item.title}
                </a>
              </li>
            ))}
          </ul>
        </section>
      ) : null}
    </section>
  );
};

export default SideBar;
