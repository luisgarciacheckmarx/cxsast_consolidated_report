import dateFormat from 'dateformat';
import yargs from 'yargs';
import { getReportData } from './controllers/scansController';
import { EmailService } from './services';
import { logger, handleError, validateArgs, reportGenerator } from './utils';

const log = logger('main');
const args = yargs.argv;

const main = async () => {
    validateArgs(args);

    log.info('fetching scans data ...');

    try {
        const date = new Date();
        const data = await getReportData(String(args.projectPattern));
        log.info('Finished the data fetch!');

        const compiledTemplate = reportGenerator.getCompiledHtml({
            ...data,
            totalUnresolvedIssues: data.combinedResults.newIssues + data.combinedResults.recurrentIssues,
            currentDate: dateFormat(date, 'dddd, mmmm dS, yyyy, h:MM:ss TT'),
            year: dateFormat(date, 'yyyy'),
            appName: String(args.appName),
        });

        EmailService.sendEmail(compiledTemplate, String(args.emailSubject), String(args.emailRecipients), String(args.appName));
    } catch (error) {
        handleError(error);
    }
};

main();
