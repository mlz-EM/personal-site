const config = {
  moduleNameMapper: {
    '^.+\\.(css|less|scss)$': 'babel-jest',
    '^.+\\.md$': 'markdown-to-jsx',
    '^react-markdown$': '<rootDir>/src/__tests__/mocks/reactMarkdown.js',
    '^remark-math$': '<rootDir>/src/__tests__/mocks/noopPlugin.js',
    '^rehype-katex$': '<rootDir>/src/__tests__/mocks/noopPlugin.js',
  },
  testPathIgnorePatterns: [
    '/node_modules/',
    '<rootDir>/src/__tests__/mocks/',
  ],
};

module.exports = config;
