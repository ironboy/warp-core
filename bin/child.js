const path = require('path');
const fs = require('fs');
const exec = (require('child_process')).execSync;
const ncp = require('ncp');
const rimraf = require('rimraf');

// Paths (mostly set in installReact)
const paths = {
  myBase: path.join(__dirname, '..')
};

// a function to run npm installs, run async
function npmInstall(...packages){
  return new Promise((res, rej) => {
    // yeah we had other code here before
    // now we are just writing to package.json
    let p = require(path.join(paths.projectFolder, 'package.json'));
    for(let p of packages){

    }
  });
}

// Functions to run
// (will be added below)
const tasksFuncs = {};

tasksFuncs['Installing React using create-react-app'] = () => {
  let a = process.argv;
  if(a.length < 3){
    return {
      error: 'Please provide a folder name for your project'
    }
  }
  if(!a[2].match(/^[a-z0-9-]*$/)){
    return {
      error: 'Please only use small letters, digits and hyphens in your foldername'
    }
  }
  if(fs.existsSync(path.join(process.cwd(), a[2]))){
    return {
      error: 'The folder ' + a[2] + ' already exists... Please remove it!'
    };
  }
  exec('npx create-react-app@1.5.2 ' + a[2], {windowsHide: true});
  process.chdir(a[2]);
  paths.projectFolder = process.cwd();
  paths.configFolder = path.join(paths.projectFolder, 'config');
  paths.ejectScript = path.join(paths.projectFolder, 'node_modules', 'react-scripts', 'scripts', 'eject.js');
  paths.ejectScriptModified = paths.ejectScript.split('eject.js').join('eject-modded.js');
  return {success: true};
}

tasksFuncs['Adding modules to package.json'] = () => {
  let myVersion = (require(path.join(paths.myBase, 'package.json'))).version;
  let pjPath = path.join(paths.projectFolder, 'package.json');
  let pj = require(pjPath);
  Object.assign(pj.dependencies, {
    "react-warp-core": "^" + myVersion,
    "express": "^4.16.3",
    "node-sass": "^4.9.3",
    "react-router-dom": "^4.3.1",
    "sass-loader": "^7.1.0",
    "mobx": "^5.1.2",
    "mobx-react": "^5.2.8",
    "babel-plugin-transform-decorators-legacy": "^1.3.5",
    "jquery": "^3.3.1",
    "bootstrap": "^4.1.3",
    "reactstrap": "^6.4.0",
    "react-clock": "^2.3.0"
  });
  fs.writeFileSync(pjPath, JSON.stringify(pj,'','  '), 'utf-8');
  return {success: true};
  // Actual install done by the eject script :D
}

tasksFuncs['Ejecting the project'] = () => {
  // Eject the React project if not done
  if(!fs.existsSync(paths.configFolder)){

    if(!fs.existsSync(paths.ejectScript)){
      return {
        error: 'Can not find the eject script!'
      };
    }

    // Copy and modifify the eject script so it doesn't require a yes prompt
    let ejectContent = fs.readFileSync(paths.ejectScript, 'utf-8');
    ejectContent = ejectContent
      .split("const inquirer = require('react-dev-utils/inquirer')")
      .join("const inquirer = {prompt: () => ({then: (x) => x({shouldEject:true})})}");
    fs.writeFileSync(paths.ejectScriptModified, ejectContent, 'utf-8');
    
    // Run
    require(paths.ejectScriptModified);

    return {success: true};
  }

}

tasksFuncs['Adding transform-decorators as a Babel plugin'] = () => {
  let pjPath = path.join(paths.projectFolder, 'package.json');
  let pj = require(pjPath);
  pj.babel = pj.babel || {};
  pj.babel.plugins = pj.babel.plugins || [];
  pj.babel.plugins.push('transform-decorators-legacy');
  fs.writeFileSync(pjPath, JSON.stringify(pj,'','  '), 'utf-8');
  return {success: true};
}

tasksFuncs['Stop VSC decorator warnings by adding a tsconfig.json file'] = () => {
  let settings = {
    "compilerOptions": {
      "experimentalDecorators": true,
      "allowJs": true,
      "noUnusedLocals": true
    }
  } 
  fs.writeFileSync(
    path.join(paths.projectFolder, 'tsconfig.json'),
    JSON.stringify(settings,'','  '),
    'utf-8'
  );
  return {success: true};
}

tasksFuncs['Relaxing eslint rules in package.json'] = () => {
  let pjPath = path.join(paths.projectFolder, 'package.json');
  let pj = require(pjPath);
  pj.eslintConfig = pj.eslintConfig|| {};
  pj.eslintConfig.rules = pj.eslintConfig.rules || {};
  Object.assign(pj.eslintConfig.rules, {
    "react/react-in-jsx-scope": "off",
    "react/jsx-no-undef": "off",
    "no-unused-expressions": "off",
    "no-unused-vars": "off",
    "no-undef": "off"
  });
  fs.writeFileSync(pjPath, JSON.stringify(pj,'','  '), 'utf-8');
  return {success: true};
}

tasksFuncs['Adding react-warp-core-options to package.json'] = () => {
  let pjPath = path.join(paths.projectFolder, 'package.json');
  let pj = require(pjPath);
  Object.assign(pj, {
    "react-warp-core": {
      "path-to-common-imports": "common-imports.json"
    }
  });
  fs.writeFileSync(pjPath, JSON.stringify(pj,'','  '), 'utf-8');
  return {success: true};
}



tasksFuncs['Patching the dev config to use new webpack loaders'] = () => {
  let modFileContents = fs.readFileSync(path.join(paths.myBase,'mod-webpack.config.dev.js'),'utf-8');
  let configFileContents =  fs.readFileSync(path.join(paths.configFolder,'webpack.config.dev.js'),'utf-8');
  // Modify the file content if not done
  if(modFileContents !== configFileContents ){
    fs.renameSync(
      path.join(paths.configFolder,'webpack.config.dev.js'),
      path.join(paths.configFolder,'org-webpack.config.dev.js'),
    );
    fs.copyFileSync(
      path.join(paths.myBase,'mod-webpack.config.dev.js'),
      path.join(paths.configFolder,'webpack.config.dev.js'),
    );
  }
  return {success: true};
}

tasksFuncs['Adding proxy settings for Express'] = () => {
  const packagePath = path.join(paths.projectFolder, 'package.json');
  let packageJson = require(packagePath);
  packageJson.proxy = {
    "/api$|/api/": {
      "target": "http://localhost:5000",
      "pathRewrite": {
        "^/api" : "/"
      },
      "ws": true
    }
  };
  fs.writeFileSync(packagePath, JSON.stringify(packageJson,'','  '), 'utf-8');
  return {success: true};
}

tasksFuncs['Adding a folder for the Express app'] = () => {
  const expressFolder = path.join(paths.projectFolder, 'express');
  if (!fs.existsSync(expressFolder)){
    fs.mkdirSync(expressFolder);
    fs.copyFileSync(
      path.join(paths.myBase,'express-app-example.js'),
      path.join(expressFolder,'app.js'),
    );
  }
  return {success: true};
}

tasksFuncs['Removing the src folder from create react app'] = () => {
  const srcFolder = path.join(paths.projectFolder, 'src');
  return new Promise((res,rej) => {
    rimraf(srcFolder, (err)=> {
      if(err){ res({error:err}); }
      else { res({success: true}); }
    })
  });
}

tasksFuncs['Installing a src folder with an example application'] = () => {
  const toCopy = path.join(paths.myBase, 'example-src-folder');
  const srcFolder = path.join(paths.projectFolder, 'src');
  return new Promise((res,rej) => {
    ncp(toCopy, srcFolder, (err)=> {
      if(err){ res({error:err}); }
      else { res({success: true}); }
    })
  });
}

tasksFuncs['Installing a common-imports.json example file'] = () => {
  fs.copyFileSync(
    path.join(paths.myBase,'common-imports-example.json'),
    path.join(paths.projectFolder, 'common-imports.json'),
  );
  return {success: true};
}


async function asleep(ms){
  return new Promise((res) => setTimeout(res, ms));
}

async function taskRunner(){
  let fakeRun = false;
  let taskNames = Object.keys(tasksFuncs);
  let len = taskNames.length;
  while(taskNames.length){
    let current = taskNames.shift();
    process.send({start: current, step: len - taskNames.length, total: len});
    if(fakeRun){
      await asleep(5000);
      process.send({success: true});
    }
    else {
      let result = await tasksFuncs[current]()
      process.send(result);
      if(result.error){ process.exit(); }
    }
  }
  process.send({done: true});
  process.exit();
}

taskRunner();