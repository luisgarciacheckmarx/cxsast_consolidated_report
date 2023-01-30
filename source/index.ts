
import yargs from 'yargs';

import { logger, handleError, validateArgs, reportGenerator } from './utils';

const log = logger('main');
const args = yargs.argv;

const main = async () => {
    
    console.log('Hola caracola ');
    validateArgs(args);
};

main();
