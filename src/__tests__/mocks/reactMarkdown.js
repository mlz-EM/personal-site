const React = require('react');
const PropTypes = require('prop-types');

const ReactMarkdown = ({ children }) => React.createElement(React.Fragment, null, children);

ReactMarkdown.propTypes = {
  children: PropTypes.node.isRequired,
};

module.exports = ReactMarkdown;
