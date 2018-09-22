// A webpack loader that converts html and jsx files to render methods
// if they have the same name and are in the same folder as
// the javascript component file

const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar'); // is included in react-start-app
const includeCommonImports = require(path.join(__dirname, 'include-common-imports.js'));

// path to src folder
const srcFolder = path.join(process.cwd(), 'src');


// get the contents of a list of htm/html and js files
function collect(){
  let arrOfJsFiles = [];
  let all = {nameToContent: {}, contentToName: {}};
  let files = getFiles();
  for(let file of files){
     if(file.endsWith('.js')){
       arrOfJsFiles.push(file);
     }
     if(file.endsWith('.jsx') || file.endsWith('.html') || file.endsWith('.htm') || file.endsWith('.js')){
       all.nameToContent[file] = fs.readFileSync(file, 'utf-8');
       all.contentToName[all.nameToContent[file]] = file;
     }
  }
  return all;
}

// get all file paths in a folder recursively
function getFiles(folder = srcFolder){
  let all = [];
  let f = fs.readdirSync(folder);
  for(file of f){
    all.push(path.join(folder,file))
    if(fs.lstatSync(path.join(folder,file)).isDirectory()){
      all = all.concat(getFiles(path.join(folder,file)));
    }
  }
  return all;
}

function touch(path){
  if(fs.existsSync(path)){
    let s = fs.statSync(path);
    let atime = new Date(s.atime);
    let mtimeChanged = new Date(new Date(s.mtime).getTime() + 1000);
    fs.utimesSync(path, atime, mtimeChanged);
  }
}

let last;
let collected;
module.exports = function(source){
  // if new compile (based on time difference) then collect
  if(!last || last + 1000 < Date.now()){ collected = collect(); }
  // find the file path
  let path = collected.contentToName[source];
  // if found check for a corresponding html path
  if(path){
    // look for corresponding html/htm/jsx file and its contents
    let jsxFile = path.split('.').slice(0, -1).concat('jsx').join('.');
    let htmlFile = path.split('.').slice(0, -1).concat('html').join('.');
    let htmFile = htmlFile.slice(0,-1);
    let html = collected.nameToContent[htmlFile] || collected.nameToContent[htmFile] || collected.nameToContent[htmlFile] || collected.nameToContent[jsxFile];
    // if found add html as render method
    if(html){
      source = source.replace(
        /(class\s{1,}\S{1,}[^\{]*{)/g,
        '$1 render(){return __html.apply(this);}'
      );
      source += '\nfunction __html(){return (' + html + ');}';
    }
    // include common imports
    // - inspired by the resolve webpack plugin
    source = includeCommonImports(path, source);
  }
  last = Date.now();
  return source;
}

// watch for changes in html files
// then trigger a webpack compile by making a small change in the js file
// (and unchange again a second later)
chokidar.watch(srcFolder, {ignored: /(^|[\/\\])\../}).on('all', (event, file) => {
  if(file.endsWith('.html') || file.endsWith('.htm') || file.endsWith('.jsx')){
     let jsFile = file.split('.').slice(0, -1).concat('js').join('.');
     touch(jsFile);
  }
});