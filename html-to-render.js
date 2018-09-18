// A webpack loader that converts html and jsx files to render methods
// if they have the same name and are in the same folder as
// the javascript component file

const path = require('path');
const fs = require('fs');
const chokidar = require('chokidar'); // is included in react-start-app

// path to src folder
const srcFolder = path.join(process.cwd(), 'src');

// get the contents of a list of htm/html and js files
function collect(){
  let all = {nameToContent: {}, contentToName: {}};
  let files = getFiles();
  for(let file of files){
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
  }
  last = Date.now();
  return source;
}

// watch for changes in html files
// then trigger a webpack by making a small change in the js file
// (and unchange again a second later)
chokidar.watch(srcFolder, {ignored: /(^|[\/\\])\../}).on('all', (event, file) => {
  if(file.endsWith('.html') || file.endsWith('.htm') || file.endsWith('.jsx')){
     let jsFile = file.split('.').slice(0, -1).concat('js').join('.');
     if(fs.existsSync(jsFile)){
       let content = fs.readFileSync(jsFile, 'utf-8');
       let content2 = content + '\n';
       fs.writeFileSync(jsFile, content2, 'utf-8');
       setTimeout(() => fs.writeFileSync(jsFile, content, 'utf-8', 100));
     }
  }
});