import nodemailer from 'nodemailer';
import { logger, config, reportGenerator, handleError } from '../utils';

const log = logger('email service');
const cfg = config.email;

const transporter = nodemailer.createTransport({
    host: cfg.host,
    port: cfg.port,
    auth: {
        user: cfg.sender,
        pass: cfg.password,
    },
});

const sendEmail = (html: any, subject: string, recievers: string, appName: string) => {
    log.info('Sending Email(s)...');

    const opts = {
        from: cfg.sender,
        to: recievers,
        subject,
        html,
    };

    transporter.sendMail(opts, async (err: any) => {
        if (err) {
            log.info(`Failed to send the email(s)! - ${err}`);
            try {
                await reportGenerator.saveHtmlFile(html, appName);
            } catch (saveError) {
                handleError(saveError);
            }
        } else {
            log.info('Email(s) sent!');
        }
    });
};

export default {
    sendEmail,
};
