const fs = require('fs');
const path = require('path');
const util = require('util');
const mkdirp = require('mkdirp');

const writeFile = util.promisify(fs.writeFile);

const componentDir = path.join(__dirname, '/src/components');

if (!process.argv[2]) {
  console.error('Please provide a component name');
} else {
  writeFiles(process.argv[2]);
}

async function writeFiles(componentName) {
  if (!componentName.match(/^[A-Z]/)) {
    componentName =
      componentName.charAt(0).toUpperCase() + componentName.slice(1);
  }

  try {
    createDir(`${componentDir}/${componentName}`);
  } catch (error) {
    return console.error(error.message);
  }

  await writeFile(
    `${componentDir}/${componentName}/${componentName}.jsx`,
    `<Fragment>

</Fragment>`
  ).catch(error => {
    if (error) {
      return console.error('Could not write .jsx file: ' + error.message);
    }
  });

  await writeFile(
    `${componentDir}/${componentName}/${componentName}.js`,
    `export default class ${componentName} extends Component {
  async start() {}
}`
  ).catch(error => {
    if (error) {
      return console.error('Could not write .js file: ' + error.message);
    }
  });
}

function createDir(dir) {
  if (!fs.existsSync(dir)) {
    mkdirp.sync(dir);
  } else {
    throw new Error('Component directory already exists!');
  }
}
