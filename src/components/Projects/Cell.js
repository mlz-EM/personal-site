import React from 'react';
import PropTypes from 'prop-types';
import dayjs from 'dayjs';

const Cell = ({ data }) => (
  <div className="cell-container">
    <article className="mini-post">
      <header>
        <h3>
          {data.title}
        </h3>
        <time className="published">
          {dayjs(data.date).format('MMMM DD, YYYY')}
        </time>
      </header>
      <a href={data.link} className="image" target="_blank" rel="noopener noreferrer">
        <img src={`${process.env.PUBLIC_URL}${data.image}`} alt={data.title} />
      </a>
      <div className="description">
        <p>
          {data.desc}{' '}
          <a href={data.link} target="_blank" rel="noopener noreferrer">
            <strong>(Click to Read More)</strong>
          </a>
        </p>
      </div>
    </article>
  </div>
);

Cell.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    link: PropTypes.string.isRequired,
    image: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    desc: PropTypes.string.isRequired,
  }).isRequired,
};

export default Cell;
