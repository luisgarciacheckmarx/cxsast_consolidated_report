
//import dateFormat from 'dateformat'; 
//import yargs from 'yargs';
//import { getReportData } from './controllers/scansController';
//import { EmailService } from './services';
//import { handleError } from './utils';

//const log = logger('main');
//const args = yargs.argv;

import * as log4js from "log4js";
log4js.configure({
  appenders: { cheese: { type: "file", filename: "cheese.log" } },
  categories: { default: { appenders: ["cheese"], level: "error" } },
});

const logger = log4js.getLogger();
logger.level = "debug";
logger.debug("Some debug messages");





console.log('Hola caracola 1 ');

const main = () => {
    //validateArgs(args);
    console.log('Hola caracola 2');
    
    //log.info('fetching scans data ...');

    try {
        //const date = new Date();
        //const data = await getReportData(String('nameRegex'));
        console.log('Finished the data fetch!');

        //const compiledTemplate = reportGenerator.getCompiledHtml({
        //    ...data,
        //    totalUnresolvedIssues: data.combinedResults.newIssues + data.combinedResults.recurrentIssues,
        //    currentDate: dateFormat(date, 'dddd, mmmm dS, yyyy, h:MM:ss TT'),
        //    year: dateFormat(date, 'yyyy'),
        //    appName: String('appName'),
        //});
        //const compiledTemplate = "";
        console.log('Hola caracola 2.1');

        //EmailService.sendEmail(compiledTemplate, 'emailSubject', 'emailRecipients', 'appName');
    } catch (error) {
        console.log('Hola caracola 3');
        //handleError(error);
    }
};

console.log('Hola caracola 0 ');
main();
console.log('Hola caracola 4');
