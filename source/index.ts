import dateFormat from 'dateformat';
import yargs from 'yargs';
import { setProjectsData, combinedResults, resultsByProject } from './controllers/scansController';
import { EmailService } from './services';
import { logger, handleError } from './utils';

const log = logger('main');
const args = yargs.argv;

const main = async () => {
    log.info('fetching scans data ...');
    try {
        await setProjectsData(String(args.projectPattern));
        log.info('Finished the data fetch!');

        const emailBodyData = {
            combinedResults,
            resultsByProject,
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
