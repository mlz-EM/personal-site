import React from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import contactInfo from '../data/contact';

const ContactIcons = () => (
  <ul className="icons">
    {contactInfo.map((s) => (
      <li key={s.label}>
        <a href={s.link} aria-label={s.label} target="_blank" rel="noreferrer">
          <FontAwesomeIcon icon={s.icon} size="lg" />
        </a>
      </li>
    ))}
  </ul>
);

export default ContactIcons;
