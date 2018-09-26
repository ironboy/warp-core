const fs = require('fs');
const path = require('path');
const srcFolder = path.join(process.cwd(), 'src');
const pj = require(path.join(process.cwd(), 'package.json'));

let pathToCommonImports = pj && pj['react-warp-core'] && pj['react-warp-core']['path-to-common-imports'];
pathToCommonImports = path.join(process.cwd(), pathToCommonImports || 'common-imports.json');


function findDescendants(me, arr){
  let i = me.i;
  while(arr[i + 1] && arr[i + 1].indent > me.indent){
    i++;
    me.descendants.push(arr[i]);
  }
}

let imports;

function parseImports(){
  imports = [];
  let json;
  try { json = JSON.parse(fs.readFileSync(pathToCommonImports, 'utf-8')); }
  catch(e){}
  if(json){
    for(let i in json){
      let noImportsTo = false;
      let moduleName = i.trimLeft();
      if(moduleName.startsWith('/*')){ continue; }
      if(moduleName.startsWith('!')){
        moduleName = moduleName.substr(1);
        noImportsTo = true;
      }
      let indent = i.length - moduleName.length;
      let _path = json[i];
      let inNodeModules = true;
      try { require.resolve(_path); }
      catch(e){ inNodeModules = false; }
      let orgPath = _path;
      _path = inNodeModules ? _path : path.join(srcFolder, _path);
      let syntax = 'import ' + moduleName + " from '" + _path + "'";
      if(!orgPath){
        syntax = 'import "' + moduleName + '"';
      }
      imports.push({
        i: imports.length,
        syntax: syntax, 
        path: _path,
        indent: indent,
        descendants: [],
        noImportsTo: noImportsTo
      });
    }
    for(let x of imports){
      findDescendants(x, imports);
    }
  }
  
}

module.exports = function includer(path, source){
  imports || parseImports();
  let me = imports.filter(x => x.path === path || x.path + '.js' === path)[0];
  let importStr = me && me.noImportsTo ? '' : imports
    .filter(x => !me || !([me, ...me.descendants].includes(x)))
    .map(x => x.syntax)
    .join(';');
  importStr = importStr ? importStr + ';' : '';
  importStr = importStr.split('\\').join('/'); 
  return importStr + source;
}

// get all js file paths in a folder recursively
function getJSFiles(folder = srcFolder){
  let all = [];
  let f = fs.readdirSync(folder);
  for(file of f){
    all.push(path.join(folder,file))
    if(fs.lstatSync(path.join(folder,file)).isDirectory()){
      all = all.concat(getJSFiles(path.join(folder,file)));
    }
  }
  return all.filter(x => x.endsWith('.js'));
}

function touch(path){
  if(fs.existsSync(path)){
    let s = fs.statSync(path);
    let atime = new Date(s.atime);
    let mtimeChanged = new Date(new Date(s.mtime).getTime() + 1000);
    fs.utimesSync(path, atime, mtimeChanged);
  }
}


// WATCH FOR CHANGES IN THE common-imports.json
// For some strange reason - couldn't get chokidar
// to work on this on - so fs.watch for now
let start = Date.now(), restartTimeout;
fs.watch(pathToCommonImports, (...args) => {

  // just to be sure not to react on any potential
  // false triggers at startup
  if(Date.now() - start < 1000){ return; }
  clearTimeout(restartTimeout);
  
  // oh boy :) since common imports have changed
  // we need to trigger recompiles of every js file inside src
  // (or restart the webpack server - which is too time consuming)
  // now run through them making small temporarily changes to each of them
  imports = false;
  let allJsFiles = getJSFiles(srcFolder);
  for(let jsFile of allJsFiles){
      touch(jsFile);
  }
});