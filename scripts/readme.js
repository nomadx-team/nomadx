const { promisify } = require('util');
const fs = require('fs');

const readdir = promisify(fs.readdir);
const readFile = promisify(fs.readFile);
const writeFile = promisify(fs.writeFile);

async function getPackages() {
    const packages = await readdir('./packages');
    return packages.sort().filter(name => !name.startsWith('.'));
}

function getPackageMeta(packages) {
    return packages.map(package => {
        return {
            name: `@nomadx/${package}`,
            readme: `./packages/${package}/README.md`
        }
    });
}

function buildPackageList(packages) {
    return packages.map(package => {
        return `- [${package.name}](${package.readme})`
    }).join('\n');
}

async function buildREADME(list) {
    const README = await readFile('./README.md', 'utf8');
    const regex = /## Packages\n(.*)\n##/gs;
    const newFile = README.replace(regex, `## Packages
${list}

##`)
    return newFile;
}

async function run() {
    const packages = await getPackages();
    const list = buildPackageList(getPackageMeta(packages))
    const content = await buildREADME(list);
    await writeFile('./README.md', content);
}

run();