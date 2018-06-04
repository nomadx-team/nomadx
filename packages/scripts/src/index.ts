import { commit } from './commands/commit';
import { publish } from './commands/publish';

async function run(argv: string[]) {
    switch (argv[0]) {
        case 'commit':
            await commit();
            break;
        case 'publish':
            await publish(argv[1]);
            break;
        default:
            console.log(`
  The following is an invalid command: ${argv[0]}
  - please pass a command to execute: deploy, publish
    `);
            process.exit(1);
    }
}

export {
    run
}
