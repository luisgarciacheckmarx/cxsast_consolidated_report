import dateFormat from 'dateformat';
import yargs from 'yargs';
import { setProjectsData, combinedResults, resultsByScan, vulnerabilities } from './controllers/scansController';
import { EmailService } from './services';
import { logger, handleError, validateArgs, reportGenerator } from './utils';
import { inspect } from 'util';

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
            vulnerabilities,
            totalUnresolvedIssues: combinedResults.newIssues + combinedResults.recurrentIssues,
            currentDate: dateFormat(new Date(), 'dddd, mmmm dS, yyyy, h:MM:ss TT'),
            appName: String(args.appName),
        });

        console.log(
            inspect({
               combinedResults,
                vulnerabilities},

                true,
                1000,
                true
            )
        );

        EmailService.sendEmail(compiledTemplate, String(args.emailSubject), String(args.emailRecipients), String(args.appName));
    } catch (error) {
        handleError(error);
    }
};

main();
