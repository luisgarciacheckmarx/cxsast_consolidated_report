import dateFormat from 'dateformat';
import yargs from 'yargs';
import { setProjectsData, combinedResults, resultsByScan } from './controllers/scansController';
import { EmailService } from './services';
import { logger, handleError, validateArgs, reportGenerator } from './utils';

const log = logger('main');
const args = yargs.argv;

const main = async () => {
    validateArgs(args);

    log.info('fetching scans data ...');

    try {
        await setProjectsData(String(args.projectPattern));
        log.info('Finished the data fetch!');

        const compiledTemplate = reportGenerator.getCompiledHtml({
            combinedResults,
            resultsByScan,
            totalUnresolvedIssues: combinedResults.newIssues + combinedResults.recurrentIssues,
            currentDate: dateFormat(new Date(), 'dddd, mmmm dS, yyyy, h:MM:ss TT'),
            appName: String(args.appName),
        });

        EmailService.sendEmail(compiledTemplate, String(args.emailSubject), String(args.recievers), String(args.appName));
    } catch (error) {
        handleError(error);
    }
};

main();
