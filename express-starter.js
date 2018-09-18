let chalk = require('chalk');

function center(text){
  while(text.length < 45){
    if(text.length%2){
      text = ' ' + text;
    }
    else {
      text += ' ';
    }
  }
  return text;
}

module.exports = function expressStart(basePath){

  // Start and restart Express
  const path = require('path');
  const expressDir = path.join(basePath, 'express');
  const publicIndex = path.join(basePath, 'public', 'index.html');
  const appPath = path.join(expressDir, 'app.js');
  const fs = require('fs');
  const express = require('express');
  const chokidar = require('chokidar');
  let server;
  function startApp(){
    server && server.close();
    global.app = express();
    purgeCache(appPath);
    try {
      require(appPath);
      server = app.listen(5000, ()=> 
        console.log(chalk.bgHex('#0C0').hex('#fff')(center('Restarting the Express app!')))
      );
    }
    catch(e){
      console.warn(chalk.bgHex('#C00').hex('#fff')(center('Error in the Express app:')), '\n', e.stack);
    }
  }
  // watch the express folder fot changes
  let throttler;
  chokidar.watch(expressDir, {ignored: /(^|[\/\\])\../}).on('all', (event, path) => {
    clearTimeout(throttler);
    throttler = setTimeout(() => startApp());
  });

  /**
   * Removes a module from the cache
   */
  function purgeCache(moduleName) {
    // Traverse the cache looking for the files
    // loaded by the specified module name
    searchCache(moduleName, function (mod) {
        delete require.cache[mod.id];
    });

    // Remove cached paths to the module.
    // Thanks to @bentael for pointing this out.
    Object.keys(module.constructor._pathCache).forEach(function(cacheKey) {
        if (cacheKey.indexOf(moduleName)>0) {
            delete module.constructor._pathCache[cacheKey];
        }
    });
  };

  function searchCache(moduleName, callback) {
    // Resolve the module identified by the specified name
    var mod = require.resolve(moduleName);

    // Check if the module has been resolved and found within
    // the cache
    if (mod && ((mod = require.cache[mod]) !== undefined)) {
        // Recursively go over the results
        (function traverse(mod) {
            // Go over each of the module's children and
            // traverse them
            mod.children.forEach(function (child) {
                traverse(child);
            });

            // Call the specified callback providing the
            // found cached module
            callback(mod);
        }(mod));
    }
  };
}