import { logger } from '../utils';

const log = logger('cx client config');

const getConfig = () => {
    try {
        return require(process.cwd() + '/config.json');
    } catch (error) {
        log.fatal('Config file not found!');
        process.exit();
    }
};

export default getConfig();
