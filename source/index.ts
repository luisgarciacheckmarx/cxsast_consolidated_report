



import yargs from 'yargs';

const args = yargs.argv;


const main = async () => {
    
    console.log('Hola caracola ');
    validateArgs(args);

};

main();
