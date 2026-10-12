import React from 'react';
import PropTypes from 'prop-types';
import PageFrame from './PageFrame';

import Navigation from '../components/Template/Navigation';
import SideBar from '../components/Template/SideBar';
import BackToTopButton from '../components/Template/BackToTopButton';

const Main = ({
  children = null,
  fullPage = false,
  title = null,
  description = "Menglin Zhu's personal website.",
  wrapperClassName = null,
}) => (
  <PageFrame title={title} description={description}>
    <div id="wrapper" className={wrapperClassName}>
      <Navigation />
      <main id="main">{children}</main>
      {fullPage ? null : <SideBar />}
    </div>
    <BackToTopButton />
  </PageFrame>
);

Main.propTypes = {
  children: PropTypes.oneOfType([
    PropTypes.arrayOf(PropTypes.node),
    PropTypes.node,
  ]),
  fullPage: PropTypes.bool,
  title: PropTypes.string,
  description: PropTypes.string,
  wrapperClassName: PropTypes.string,
};

Main.defaultProps = {
  children: null,
  fullPage: false,
  title: null,
  description: "Menglin Zhu's personal website.",
  wrapperClassName: null,
};

export default Main;
