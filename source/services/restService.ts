import axios, { AxiosResponse, AxiosRequestConfig, AxiosError } from 'axios';
import { logger, logElapsedTime, config } from '../utils';

// tslint:disable-next-line: no-var-requires
const qs = require('querystring');

const log = logger('cx api request');
const baseURL: string = `${config.host}/cxrestapi`;
let startHrTime: [number, number] = [0, 0];

const getTokenData = async () => {
    const data = {
        username: config.username,
        password: config.password,
        grant_type: 'password',
        scope: 'sast_rest_api',
        client_id: 'resource_owner_client',
        client_secret: '014DF517-39D1-4453-B7B3-9930C563627C',
    };

    const headers = { headers: { 'Content-Type': 'application/x-www-form-urlencoded' } };

    return await axios.post(`${baseURL}/auth/identity/connect/token`, qs.stringify(data), headers);
};

const restService = (() => {
    let instance: any;

    async function init() {
        const {
            data: { token_type, access_token },
        } = await getTokenData();

        const client = axios.create({
            baseURL,
            headers: { Authorization: `${token_type} ${access_token}` },
        });

        client.interceptors.request.use(
            (cfg: AxiosRequestConfig) => {
                startHrTime = process.hrtime();
                log.info(`cx api call start - ${cfg.method!.toUpperCase()} ${cfg.baseURL}${cfg.url}`);

                return cfg;
            },
            (error: AxiosError) => {
                log.info('cx api call request error');

                return Promise.reject(error);
            }
        );

        client.interceptors.response.use((response: AxiosResponse) => {
            logElapsedTime(startHrTime, 'cx api call end -', 'cx api request');

            return response;
        });

        return {
            getProjects: async () => await client.get('/projects'),
            getScans: async (id: number, last: number) => await client.get(`/sast/scans?projectId=${id}&scanStatus=Finished&last=${last}`),
            getScanStatistics: async (id: number) => await client.get(`/sast/scans/${id}/resultsStatistics`),
        };
    }

    return {
        getInstance: async () => {
            if (!instance) {
                instance = init();
            }

            return instance;
        },
    };
})();

export default restService;
