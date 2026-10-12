import React from 'react';
import PropTypes from 'prop-types';
import { Helmet, HelmetProvider } from 'react-helmet-async';
import ScrollToTop from '../components/Template/ScrollToTop';

const PageFrame = ({ children, title, description }) => (
  <HelmetProvider>
    <ScrollToTop />
    <Helmet titleTemplate="%s | Menglin Zhu" defaultTitle="Menglin Zhu" defer={false}>
      {title && <title>{title}</title>}
      <meta name="description" content={description} />
    </Helmet>
    {children}
  </HelmetProvider>
);

PageFrame.propTypes = {
  children: PropTypes.node,
  title: PropTypes.string,
  description: PropTypes.string,
};
PageFrame.defaultProps = {
  children: null,
  title: null,
  description: "Menglin Zhu's personal website.",
};

export default PageFrame;
