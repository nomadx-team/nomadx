import { deploy } from './commands/deploy';

async function run(argv: string[]) {
    switch (argv[0]) {
        case 'deploy':
            await deploy();
            break;
        default:
            console.log(`
  The following is an invalid command: ${argv[0]}
  - please pass a command to execute: deploy
    `);
            process.exit(1);
    }
}

export {
    run
}
