// Warp-core, modification of dev config
const config = require('./org-webpack.config.dev.js');
const path = require('path');
const basePath = __dirname.split(path.sep).slice(0,-1).join(path.sep);
module.exports = (require(path.join(
  basePath, 'node_modules', 'react-warp-core', 'mod-webpack-config-dev-module.js'
)))(config, basePath);
