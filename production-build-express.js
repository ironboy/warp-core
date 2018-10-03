const ncp = require('ncp').ncp;
const path = require('path');
const fs = require('fs');

module.exports = function(basePath, callback){
  fs.renameSync(path.join(basePath, 'build'), path.join(basePath, '__tmp__'));
  fs.mkdirSync(path.join(basePath, 'build'));
  fs.renameSync(path.join(basePath, '__tmp__'), path.join(basePath, 'build', 'web-root-static'));
  fs.copyFileSync(path.join(__dirname, 'express-production-server.js'), path.join(basePath, 'build', 'app.js'));
  ncp(path.join(basePath, 'express'), path.join(basePath, 'build', 'express'), () => {
    callback();
  });
}
