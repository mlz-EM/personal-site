import React, { useEffect, useState } from 'react';

const VISIBILITY_SCROLL_Y = 420;

const BackToTopButton = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => {
      setIsVisible(window.scrollY > VISIBILITY_SCROLL_Y);
    };

    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  const handleClick = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <button
      type="button"
      className={`back-to-top ${isVisible ? 'is-visible' : ''}`}
      aria-label="Back to top"
      onClick={handleClick}
    >
      <svg
        className="back-to-top-icon"
        viewBox="0 0 20 12"
        aria-hidden="true"
        focusable="false"
      >
        <polygon points="10,1.1 1.4,11 10,6.8" />
        <polygon points="10,1.1 10,6.8 18.6,11" />
      </svg>
    </button>
  );
};

export default BackToTopButton;
