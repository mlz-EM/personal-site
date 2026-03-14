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
      <span aria-hidden="true">↑</span>
    </button>
  );
};

export default BackToTopButton;
