const path = require('path');
const webpack = require('webpack');

module.exports = function(config, basePath){

  // This has nothing to do with webpack but is
  // here since this code runs on a npm start
  
  // 1) node-sass needs to be rebuilt for different node versions
  const exec = (require('child_process')).execSync;
  exec('npm rebuild node-sass');

  // 2) we want to start up the express starter/restarter
  (require('./express-starter.js'))(basePath);


  // Add a webpack provider plugin
  new webpack.ProvidePlugin({
    'React': 'react'
  });


  // NOW LET'S START MODIFYING WHAT WEBPACK LOADERS ARE USED

  // Delete the rule property forcing linting to be first
  delete config.module.rules[0].enforce;

  // Reorder so that linting is before Babel
  config.module.rules.push(config.module.rules.shift());

  // Add a loader that converts html files to render methods
  // if they have the same name and are in the same folder as
  // the javascript component file
  config.module.rules.push({
    test: /\.js/,
    use: [
      {loader: path.join(basePath, 'node_modules', 'react-warp-core', 'html-to-render.js')}
    ]
  });

  // Add a SASS loader (by copying and modifying the CSS loader)
  config.module.rules = config.module.rules.map(x => {
    if(!x.oneOf){ return x; }
    let newOne, index;
    x.oneOf.forEach((y, i) => {
      if((y.test + '').includes('.css')){
        index = i;
        // add source mapping
        y.use[1].options.sourceMap = 1;
        // copy
        newOne = JSON.parse(JSON.stringify(y));
      }
    });
    // if we found the css loader, modify, copy and insert as scss loader
    if(newOne){
      newOne.test = /\.scss$/;
      newOne.use.splice(2, 0, {
        loader: path.join(basePath, 'node_modules', 'sass-loader', 'lib', 'loader.js')
      });
      x.oneOf.splice(index - 1, 0, newOne);
    }
    return x;
  });

  return config;
}
