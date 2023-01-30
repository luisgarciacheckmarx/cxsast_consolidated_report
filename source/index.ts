import dateFormat from 'dateformat';
import yargs from 'yargs';
import { getReportData } from './controllers/scansController';
import { EmailService } from './services';
import { logger, handleError, validateArgs, reportGenerator } from './utils';

const log = logger('main');
const args = yargs.argv;

const main = async () => {
    
    console.log('Hola caracola ');
};

main();
