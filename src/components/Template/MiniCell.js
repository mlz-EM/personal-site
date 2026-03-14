import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

const MiniCell = ({ data }) => (
  <div className="cell-container">
    <div className="minicell">
      {data.link ? (
        <a href={data.link} className="image" target="_blank" rel="noopener noreferrer">
          <img
            src={`${process.env.PUBLIC_URL}${data.image}`}
            alt={data.label}
            loading="lazy"
            decoding="async"
          />
        </a>
      ) : (
        <div className="image">
          <img
            src={`${process.env.PUBLIC_URL}${data.image}`}
            alt={data.label}
            loading="lazy"
            decoding="async"
          />
        </div>
      )}
      <header>
        <h3 className="minicell-title">
          {data.link ? (
            <a href={data.link} target="_blank" rel="noopener noreferrer">{data.label}</a>
          ) : data.label}
        </h3>
        <time className="published">Published: {dayjs(data.date).format('MMMM DD, YYYY')}</time>
      </header>
    </div>
  </div>
);

MiniCell.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string.isRequired,
    link: PropTypes.string,
    image: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
  }).isRequired,
};

export default MiniCell;
