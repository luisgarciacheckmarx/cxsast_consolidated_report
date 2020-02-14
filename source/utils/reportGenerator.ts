import fs from 'fs-extra';
import handlebars from 'handlebars';
import { join as pathJoin } from 'path';
import { config, handleError, logger } from '../utils';

// tslint:disable-next-line: no-var-requires
const sanitize = require('sanitize-filename');
const log = logger('report generator');

const getCompiledHtml = (data: any) => {
    const templateSource = fs.readFileSync(pathJoin(process.cwd(), 'resources/templates/consolidated-report.html'), 'utf8').toString();
    const template: any = handlebars.compile(templateSource);

    return template(data);
};

const saveHtmlFile = async (htmlContent: any, appName: string) => {
    const fallbackLocation = config.email.fallbackLocation;

    if (fallbackLocation) {
        try {
            log.info('Saving to the filesystem...');

            const filename = `${sanitize(appName)}-${new Date().getTime()}`;
            const dir = pathJoin(process.cwd(), fallbackLocation);
            const filePath = `${dir}/${filename}.html`;

            await fs.ensureDir(dir);
            await fs.writeFile(filePath, htmlContent);

            log.info(`File was saved on ${filePath}`);
        } catch (err) {
            handleError(err);
        }
    }
};

export default {
    getCompiledHtml,
    saveHtmlFile,
};
