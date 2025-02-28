import React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import contactInfo from '../data/contact';

const ContactIconsVertical = () => (
  <ul className="icons">
    {contactInfo.map((s) => (
      <li key={s.label} className="contact-item" style={{ display: 'block' }}>
        <a href={s.link} aria-label={s.label} target="_blank" rel="noreferrer" className="contact-link">
          <FontAwesomeIcon icon={s.icon} size="lg" />
          <span className="contact-label" style={{ marginLeft: '15px' }}>{s.label}</span>
        </a>
        <br />
      </li>
    ))}
  </ul>
);

export default ContactIconsVertical;
