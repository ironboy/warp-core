const fs = require('fs');
const path = require('path');
const util = require('util');
const mkdirp = require('mkdirp');

const writeFile = util.promisify(fs.writeFile);

const componentDir = path.join(__dirname, '../src/components');
const commonImportsFile = path.join(__dirname, '../common-imports.json');

if (!process.argv[2]) {
  console.error('Please provide a component name');
} else {
  writeFiles(process.argv[2])
    .then(() => writeToCommonImports(capitalizeFirstLetter(process.argv[2])))
    .then(() =>
      console.log(
        `Component ${capitalizeFirstLetter(
          process.argv[2]
        )} created and added to common-imports.json`
      )
    )
    .catch(error => error);
}

async function writeFiles(componentName) {
  if (!componentName.match(/^[A-Z]/)) {
    componentName = capitalizeFirstLetter(componentName);
  }

  try {
    createDir(`${componentDir}/${componentName}`);
  } catch (error) {
    console.error(error.message);
    throw error;
  }

  await writeFile(
    `${componentDir}/${componentName}/${componentName}.jsx`,
    `<Fragment>

</Fragment>`
  ).catch(error => {
    if (error) {
      console.error('Could not write .jsx file: ' + error.message);
      throw error;
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

function writeToCommonImports(componentName) {
  let content = fs
    .readFileSync(commonImportsFile)
    .toString()
    .split('\n');
  if (content.find(line => line.startsWith(`  "  ${componentName}"`))) {
    return;
  }
  const targetIndex = content.findIndex(line => line.startsWith('  "/*3"'));
  content.splice(
    targetIndex - 1,
    0,
    `  "  ${componentName}": "components/${componentName}/${componentName}",`
  );
  try {
    if (targetIndex > 0) {
      fs.writeFileSync(commonImportsFile, content.join('\n'));
    } else {
      throw new Error('could not find line starting with \'  "/*3"\'');
    }
  } catch (error) {
    console.error('Could not write common-imports: ' + error.message);
  }
}

function capitalizeFirstLetter(str) {
  return str.charAt(0).toUpperCase() + str.slice(1);
}
