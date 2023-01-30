



import yargs from 'yargs';
import { validateArgs } from './utils';

const args = yargs.argv;


const main = async () => {
    
    console.log('Hola caracola ');
    validateArgs(args);

};

main();
