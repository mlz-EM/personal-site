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
      {data.link ? (
        <a href={data.link} className="image" target="_blank" rel="noopener noreferrer">
          <img
            src={`${process.env.PUBLIC_URL}${data.image}`}
            alt={data.title}
            loading="lazy"
            decoding="async"
          />
        </a>
      ) : (
        <div className="image">
          <img
            src={`${process.env.PUBLIC_URL}${data.image}`}
            alt={data.title}
            loading="lazy"
            decoding="async"
          />
        </div>
      )}
      {data.summary ? (
        <div className="description">
          <p>
            {data.summary}
            {data.link && (
              <>
                {' '}
                <a href={data.link} target="_blank" rel="noopener noreferrer">
                  <strong>(Click to Read More)</strong>
                </a>
              </>
            )}
          </p>
        </div>
      ) : null}
    </article>
  </div>
);

Cell.propTypes = {
  data: PropTypes.shape({
    title: PropTypes.string.isRequired,
    link: PropTypes.string,
    image: PropTypes.string.isRequired,
    date: PropTypes.string.isRequired,
    summary: PropTypes.string,
  }).isRequired,
};

export default Cell;
