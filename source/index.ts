


import { logger } from './utils'; 

const log = logger('main');
const args = yargs.argv;

const main = async () => {
    
    console.log('Hola caracola ');
    log.info('Hola caracola desde log');

};

main();
