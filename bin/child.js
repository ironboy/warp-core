const path = require('path');
const fs = require('fs');
const exec = (require('child_process')).execSync;
const ncp = require('ncp');
const rimraf = require('rimraf');

// Paths (mostly set in installReact)
const paths = {
  myBase: path.join(__dirname, '..')
};

// Functions to run
// (will be added below)
const tasksFuncs = {};

tasksFuncs['Copying necessary npm modules'] = () => {
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
  process.chdir(a[2]);
  paths.projectFolder = process.cwd();

  let source = path.join(paths.myBase, 'node_modules');
  let destination = path.join(paths.myBase, 'template', 'node_modules');
  return new Promise((res,rej) => {
    ncp(source, destination, (err)=> {
      if(err){ res({error:err}); }
      else { res({success: true}); }
    })
  });
}

tasksFuncs['Installing the project folder'] = () => {
  let source = path.join(paths.myBase, 'template');
  let destination = paths.projectFolder;
  return new Promise((res,rej) => {
    ncp(source, destination, (err)=> {
      if(err){ res({error:err}); }
      else { res({success: true}); }
    })
  });
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