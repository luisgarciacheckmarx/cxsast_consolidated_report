
import dateFormat from 'dateformat';
//import yargs from 'yargs';
import { getReportData } from './controllers/scansController';
import { EmailService } from './services';
import { logger, handleError, reportGenerator } from './utils';

const log = logger('main');
//const args = yargs.argv;

const main = async () => {
    //validateArgs(args);

    log.info('fetching scans data ...');

    try {
        const date = new Date();
        const data = await getReportData(String(args.nameRegex));
        log.info('Finished the data fetch!');

        const compiledTemplate = reportGenerator.getCompiledHtml({
            ...data,
            totalUnresolvedIssues: data.combinedResults.newIssues + data.combinedResults.recurrentIssues,
            currentDate: dateFormat(date, 'dddd, mmmm dS, yyyy, h:MM:ss TT'),
            year: dateFormat(date, 'yyyy'),
            appName: String(args.appName),
        });

        EmailService.sendEmail(compiledTemplate, 'emailSubject', 'emailRecipients', 'appName');
    } catch (error) {
        handleError(error);
    }
};

main();
