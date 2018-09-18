#!/usr/bin/env node
const path = require('path');
const fork = require('child_process').fork;
const child = fork(path.join(__dirname,'child.js'), process.argv[2] ? [process.argv[2]] : [], {silent: true});
const ProgressBar = require('progress');
const chalk = require('chalk');

let totalTicks = 75;

const bar = new ProgressBar(':bar :percent', { total: totalTicks, clear: true });
let barLeft = totalTicks, installProgress = 0, reallyDone, lastStart;

let rgb = [80, 140, 216];

function darken(){
  rgb = rgb.map(x => x * 0.9);
}

function center(text){
  while(text.length < totalTicks + 2){
    if(text.length%2){
      text = ' ' + text;
    }
    else {
      text += ' ';
    }
  }
  text = chalk.bgRgb(0,0,0)(' ') + text + chalk.bgRgb(0,0,0)(' ');
  return text;
}

bar.interrupt(chalk.bgRgb(0,0,0).hex('#fff')(center('')));
bar.interrupt(chalk.bgRgb(0,0,0).hex('#fff')(center('WARP CORE - accelerating the creation of your React app!')));

async function asleep(ms){
  return new Promise((res) => setTimeout(res, ms));
}

let prevMax = 0;
async function makeProgress(){
   while(true){
    let adjustedIp = installProgress;
    if(lastStart && lastStart.step && lastStart.step < 3){
      adjustedIp *= 3;
      prevMax = adjustedIp;
    }
    adjustedIp = Math.max(adjustedIp, prevMax)
    if(reallyDone || (barLeft && adjustedIp >= (totalTicks - barLeft) / totalTicks)){
      bar.tick();
      barLeft--;
      if(reallyDone && barLeft <= 0){
        bar.interrupt(chalk.bgRgb(0,0,0).hex('#fff')(center('')));
        bar.interrupt(chalk.bgRgb(0, 0, 0).hex('#fff')(center('All done. Start your project with "npm start" inside the project folder!')));
        bar.interrupt(chalk.bgRgb(0,0,0).hex('#fff')(center('')));
        console.log("");
        process.exit();
      }
    }
    await asleep(reallyDone ? 10 : !lastStart || lastStart.step < 3 ? 2500 : 800);
   }
}
makeProgress();

child.on('message', message => {
  if(!message){ return; }
  
  if(message.error){
    bar.interrupt(chalk.bgRgb(180,0,0).hex('#fff')(center('Error: ' + message.error)));
    bar.interrupt(chalk.bgRgb(0,0,0).hex('#fff')(center('')));
    process.exit();
  }
  else if( message.done){
    reallyDone = true;
  }
  else if (message.success){
  }
  else if (message.start) {
    lastStart = message;
    darken();
    bar.interrupt(chalk.bgRgb(0,0,0).hex('#fff')(center('')));
    bar.interrupt(chalk.bgRgb(...rgb).hex('#fff')(center(message.step + '/' + message.total + ' '  + message.start)));
    installProgress = message.step / message.total;
  }
});
