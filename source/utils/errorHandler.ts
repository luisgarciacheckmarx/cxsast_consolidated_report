import { AxiosError } from 'axios';
import { logger } from '../utils';

const log = logger('error handler');

const handleError = (error: AxiosError) => {
    let message: string = '';

    if (error.code === 'ENOTFOUND' || error.code === 'ECONNREFUSED') {
        message = 'The provided Cx server is down or unreachable!';
    } else {
        message = error.message;
        console.log(error);
    }

    log.fatal(message);

    process.exit();
};

export default handleError;
