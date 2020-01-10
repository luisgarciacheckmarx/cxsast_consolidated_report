import dateFormat from 'dateformat';
import yargs from 'yargs';
import { setProjectsData, combinedResults, resultsByScan } from './controllers/scansController';
import { EmailService } from './services';
import { logger, handleError, validateArgs } from './utils';

const log = logger('main');
const args = yargs.argv;

const main = async () => {
    validateArgs(args);

    log.info('fetching scans data ...');
    try {
        await setProjectsData(String(args.projectPattern));
        log.info('Finished the data fetch!');

        const emailBodyData = {
            combinedResults,
            resultsByScan,
            totalUnresolvedIssues: combinedResults.newIssues + combinedResults.recurrentIssues,
            currentDate: dateFormat(new Date(), 'dddd, mmmm dS, yyyy, h:MM:ss TT'),
            appName: String(args.appName),
        };

        EmailService.sendEmail(emailBodyData, String(args.emailSubject), String(args.recievers));
    } catch (error) {
        handleError(error);
    }
};

main();
