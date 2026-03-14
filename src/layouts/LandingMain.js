/* eslint-disable react/jsx-closing-tag-location */
import React from 'react';
import PropTypes from 'prop-types';
import { Helmet, HelmetProvider } from 'react-helmet-async';

// import Analytics from '../components/Template/Analytics';
import Navigation from '../components/Template/Navigation';
import ScrollToTop from '../components/Template/ScrollToTop';

const LandingMain = ({
  children = null,
  title = null,
  description = "Menglin Zhu's personal website.",
  typingDone = false,
}) => (
  <HelmetProvider>
    {/* <Analytics /> */}
    <ScrollToTop />
    <Helmet
      titleTemplate="%s | Menglin Zhu"
      defaultTitle="Menglin Zhu"
      defer={false}
    >
      {title && <title>{title}</title>}
      <meta name="description" content={description} />
    </Helmet>
    {typingDone && <Navigation />}{children}
  </HelmetProvider>
);

LandingMain.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  title: PropTypes.string,
  description: PropTypes.string,
  typingDone: PropTypes.bool,
};

LandingMain.defaultProps = {
  children: null,
  title: null,
  description: "Menglin Zhu's personal website.",
  typingDone: false,
};

export default LandingMain;
