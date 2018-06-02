import * as exec from 'await-exec';

async function prompt() {
    return await exec('bump --prompt');
}

export async function publish() {
    await prompt();
}
