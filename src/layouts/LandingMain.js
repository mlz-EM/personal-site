import React from 'react';
import PropTypes from 'prop-types';
import PageFrame from './PageFrame';

import Navigation from '../components/Template/Navigation';

const LandingMain = ({
  children = null,
  title = null,
  description = "Menglin Zhu's personal website.",
  typingDone = false,
}) => (
  <PageFrame title={title} description={description}>
    {typingDone && <Navigation />}{children}
  </PageFrame>
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
