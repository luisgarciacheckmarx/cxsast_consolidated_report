



//import yargs from 'yargs';

//const args = yargs.argv;
 
import * as yargs from 'yargs'

const main = async () => {
    
    console.info('Hola caracola 1');
    //console.log('(%d,%d)', args.x, args.y);
 let args = yargs
        .option('input', {
            alias: 'i',
            demand: true
        })
        .option('year', {
            alias: 'y',
            description: "Year number",
            demand: true
        }).argv;

    console.log(JSON.stringify(args));

};

main();




    
