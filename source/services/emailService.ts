import nodemailer from 'nodemailer';
import { logger, handleError, config } from '../utils';
import { join as pathJoin } from 'path';

// tslint:disable-next-line
const hbs = require('nodemailer-handlebars');
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

transporter.use(
    'compile',
    hbs({
        viewEngine: {
            extName: '.html',
            layoutsDir: pathJoin(process.cwd(), 'resources/templates'),
            defaultLayout: 'consolidated-report.html',
        },
        viewPath: pathJoin(process.cwd(), 'resources/templates'),
        extName: '.html',
    })
);

const sendEmail = (emailData: any, subject: string, recievers: string) => {
    log.info('Sending Email(s)...');

    const opts = {
        from: cfg.sender,
        to: recievers,
        subject,
        template: 'consolidated-report',
        context: emailData,
    };

    transporter.sendMail(opts, (err: any) => {
        if (err) {
            handleError(err);
        }
        log.info('Email(s) sent!!');
    });
};

export default {
    sendEmail,
};
