// Mock for @vercel/speed-insights/react
const React = require('react');

module.exports = {
  SpeedInsights: () => React.createElement('div', { 'data-testid': 'speed-insights' }),
};
