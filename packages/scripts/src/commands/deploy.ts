import * as exec from 'await-exec';
import * as inquirer from 'inquirer';

async function add() {
    return await exec('git add .');
}

async function commit() {
    const { message } = await inquirer.prompt<{ message: string }>([{
        type: 'input',
        name: 'message',
        message: 'Enter a commit message',
        default: 'auto-deploy'
    }]);

    return await exec(`git commit -m "${message}"`);
}

async function push() {
    return await exec('git push origin master');
}

export async function deploy() {
    await add();
    await commit();
    await push();
    console.log('Pushed files to master');
}