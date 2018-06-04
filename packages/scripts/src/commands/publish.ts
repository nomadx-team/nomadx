import * as exec from 'await-exec';
import * as semver from 'semver';
import chalk from 'chalk';

import { commit } from './commit';

function checkVersion(bump) {
    const current = require('../../package.json').version;
    const bumpTypes = ['major', 'minor', 'patch', 'premajor', 'preminor', 'prepatch', 'prerelease', 'from-git'];
    if (semver.valid(bump)) {
        if (semver.gt(bump, current)) {
            return;
        } else {
            throw new Error(`${chalk.red('Package version cannot be incremented.')} New version (${chalk.cyan(bump)}) is below the current version (${chalk.cyan(current)})`);
        }
    } else if (!bumpTypes.includes(bump)) {
        throw new Error(`Please indicate how you'd like to version this package.
    [<newversion> | major | minor | patch | premajor | preminor | prepatch | prerelease | from-git]`)
    }
}

async function version(bump) {
    checkVersion(bump);
    const { stdout: newVersion } = await exec(`npm version ${bump}`);
    console.log(`${chalk.green('✓')} Package version updated to ${chalk.cyan(newVersion)}`);
    return;
}

async function release() {
    const { stdout: result, stderr: error } = await exec(`npm publish --access public`);
    if (!error) {
        console.log(result);
    } else {
        throw new Error(error);
    }
}

export async function publish(bump) {
    await version(bump);
    await commit(bump);
    release();
}
