import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

const MiniCell = ({ data }) => (
  <div className="cell-container">
    <div className="minicell">
      <a href={data.link} className="image">
        <img src={`${process.env.PUBLIC_URL}${data.image}`} alt={data.label} />
      </a>
      <header>
        <h3 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <a href={data.link}>{data.label}</a>
          <span style={{
            fontSize: '1rem',
            fontWeight: 400,
            fontFamily: 'inherit',
            opacity: 0.8,
          }}
          >
            {data.desc}
          </span>
        </h3>
        <time className="published">Published: {dayjs(data.date).format('MMMM DD, YYYY')}</time>
      </header>
    </div>
  </div>
);

MiniCell.propTypes = {
  data: PropTypes.shape({
    label: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
  }).isRequired,
};

export default MiniCell;
