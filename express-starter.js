const chalk = require('chalk');
const path = require('path');

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

  // Read Express port from package.json
  let pj = require(path.join(basePath, 'package.json'));
  let port;
  try {
    port = pj.proxy["/api$|/api/"].target.split(':').pop() / 1;
  }
  catch(e){}
  port = !port || isNaN(port) ? 5000 : port;
 
  // Start and restart Express 
  const expressDir = path.join(basePath, 'express');
  const publicIndex = path.join(basePath, 'public', 'index.html');
  const appPath = path.join(expressDir, 'app.js');
  const fs = require('fs');
  const express = require('express');
  const chokidar = require('chokidar');
  let server;
  let restartTimeout;
  function startApp(){
    server && server.close();
    global.expressApp = express();
    purgeCache(appPath);
    try {
      require(appPath);
      server = global.expressApp.listen(port, ()=> {
        clearTimeout(restartTimeout);
        restartTimeout = setTimeout(()=>console.log(chalk.bgHex('#0C0').hex('#fff')(center('Restarted the Express app!'))),1000);
        triggerHotReload();
      });
    }
    catch(e){
      console.warn(chalk.bgHex('#C00').hex('#fff')(center('Error in the Express app:')), '\n', e.stack);
    }
  }
  
  // watch the express folder for changes
  let throttler;
  chokidar.watch(expressDir, {ignored: /(^|[\/\\])\../}).on('all', (event, path) => {
    clearTimeout(throttler);
    throttler = setTimeout(() => startApp());
  });

  function touch(path){
    if(fs.existsSync(path)){
      let s = fs.statSync(path);
      let atime = new Date(s.atime);
      let mtimeChanged = new Date(new Date(s.mtime).getTime() + 1000);
      fs.utimesSync(path, atime, mtimeChanged);
    }
  }

  function triggerHotReload(){
    // since a change to the backend might mean new data
    // is consumed in frontend trigger a hot reload by
    // temporarily changing /public/index.html
    let file = path.join(basePath, 'public', 'index.html');
    touch(file);
  }

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
    let mem = [];
    if (mod && ((mod = require.cache[mod]) !== undefined)) {
        // Recursively go over the results
        (function traverse(mod) {
            // Go over each of the module's children and
            // traverse them
            mem.push(mod);
            mod.children.forEach(function (child) {
                if(mem.indexOf(child) < 0){
                  traverse(child);
                }
            });

            // Call the specified callback providing the
            // found cached module
            callback(mod);
        }(mod));
    }
  };
}