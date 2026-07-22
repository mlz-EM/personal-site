/* eslint-disable react/jsx-closing-tag-location */
import React from 'react';
import PropTypes from 'prop-types';
import { Helmet, HelmetProvider } from 'react-helmet-async';

// import Analytics from '../components/Template/Analytics';
import Navigation from '../components/Template/Navigation';
import SideBar from '../components/Template/SideBar';
import ScrollToTop from '../components/Template/ScrollToTop';
import BackToTopButton from '../components/Template/BackToTopButton';

const Main = ({
  children = null,
  fullPage = false,
  title = null,
  description = "Menglin Zhu's personal website.",
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
    <div id="wrapper">
      <Navigation />
      <main id="main">{children}</main>
      {fullPage ? null : <SideBar />}
    </div>
    <BackToTopButton />
  </HelmetProvider>
);

Main.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  fullPage: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
};

Main.defaultProps = {
  children: null,
  fullPage: false,
  title: null,
  description: "Menglin Zhu's personal website.",
};

export default Main;
