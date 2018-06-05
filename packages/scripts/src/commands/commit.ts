import * as exec from 'await-exec';
import * as inquirer from 'inquirer';
import chalk from 'chalk';

async function gitAdd() {
    return await exec('git add .');
}

async function gitTag(version: string) {
    version = version.trim();
    return await exec(`git tag -a "${version}" -m "Version ${version}"`);
}

async function gitCommit() {
    const { message } = await inquirer.prompt<{ message: string }>([{
        type: 'input',
        name: 'message',
        message: 'Enter a commit message',
        default: 'auto-deploy'
    }]);
    return await exec(`git commit -m "${message}"`);
}

async function gitPush() {
    return await exec('git push origin master');
}

export async function commit(version?: string) {
    await gitAdd();
    if (version) { await gitTag(version); }
    await gitCommit();
    await gitPush();
    console.log(`${chalk.green('✓')} Pushed files to ${chalk.green('origin/master')}`);
}