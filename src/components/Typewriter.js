import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';

const Typewriter = ({ text, delay, onTypingDone }) => {
  const [currentText, setCurrentText] = useState('');
  const [currentIndex, setCurrentIndex] = useState(0);

  // eslint-disable-next-line consistent-return
  useEffect(() => {
    if (currentIndex < text.length) {
      const timeout = setTimeout(() => {
        setCurrentText((prevText) => prevText + text[currentIndex]);
        setCurrentIndex((prevIndex) => prevIndex + 1);
      }, delay);

      return () => clearTimeout(timeout);
    }
    if (currentIndex === (text.length)) {
      onTypingDone();
    }
  }, [currentIndex, delay, text]);

  return <h2>{currentText}</h2>;
};

Typewriter.propTypes = {
  text: PropTypes.string.isRequired,
  delay: PropTypes.number.isRequired,
  onTypingDone: PropTypes.func.isRequired,
};

export default Typewriter;
