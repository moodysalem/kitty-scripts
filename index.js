require('babel-polyfill');
require('babel-register');

require('./handleArgs').default(process.argv)
  .catch(error => console.error(error));