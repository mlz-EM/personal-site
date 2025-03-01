import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

const Badge = ({ data }) => (
  <div className="cell-container">
    <div className="badge">
      <a href={data.link} className="image">
        <img src={`${process.env.PUBLIC_URL}${data.image}`} alt={data.label} />
      </a>
      <header>
        <h3><a href={data.link}>{data.label}</a></h3>
        <time className="published">Issued: {dayjs(data.date).format('MMMM, YYYY')}</time>
      </header>
    </div>
  </div>
);

Badge.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
  }).isRequired,
};

export default Badge;
