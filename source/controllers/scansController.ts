import dateFormat from 'dateformat';
import regexParser from 'regex-parser';
import orderBy from 'lodash/orderBy';
import { INITIAL_COMBINED_RESULTS, SEVERITY_MAP, STATUS_MAP, STATE_MAP } from '../utils/constants';
import { RestService, SoapService } from '../services';
import { IStringTMap, IProject, IScan, IScanResult, IConsolidatedData, IQuery } from '../types';

const getSelectedProjects = async (nameRegex: any) => {
    const cx = await RestService.getInstance();
    const projects = await cx.getProjects();

    return projects.data.filter((project: IProject) => {
        return regexParser(nameRegex).test(project.name);
    });
};

const getLastScan = async (projectId: number) => {
    const cx = await RestService.getInstance();
    const scan = await cx.getLastScan(projectId);
    return scan.data[0];
};

const getScanResults = (scanId: number): Promise<IScanResult[]> => {
    return new Promise(async (resolve) => {
        await SoapService.getInstance().then(({ client, sessionData }: any) => {
            const data = { ...sessionData, scanId };

            client.GetResultsForScan(data, (_err: any, { GetResultsForScanResult }: any) => {
                GetResultsForScanResult.IsSuccesfull && GetResultsForScanResult.Results
                    ? resolve(GetResultsForScanResult.Results.CxWSSingleResultData)
                    : resolve([]);
            });
        });
    });
};

const getQueriesForScan = (scanId: number): Promise<IQuery[]> => {
    return new Promise(async (resolve) => {
        await SoapService.getInstance().then(({ client, sessionData }: any) => {
            const data = { ...sessionData, scanId };

            client.GetQueriesForScan(data, (_err: any, { GetQueriesForScanResult }: any) => {
                GetQueriesForScanResult.IsSuccesfull && GetQueriesForScanResult.Queries
                    ? resolve(GetQueriesForScanResult.Queries.CxWSQueryVulnerabilityData)
                    : resolve([]);
            });
        });
    });
};

export const getReportData = async (nameRegex: string): Promise<IConsolidatedData> => {
    log.debug('LGV::getReportData In getReportData ...');
    
    const combinedResults = INITIAL_COMBINED_RESULTS;
    const resultsByScan: IStringTMap<any> = [];
    let vulnerabilities: IStringTMap<any> = {};

    const selectedProjects: [IProject] = await getSelectedProjects(nameRegex);

    combinedResults.totalScannedProjects = selectedProjects.length;

    
    log.debug('LGV::getReportData  After selectedProjects ...');
    if (selectedProjects.length) {
        await Promise.all(
            selectedProjects.map(async (project: IProject) => {
                const lastScan: IScan = await getLastScan(project.id);

                if (lastScan) {
                    const data: any = {
                        id: lastScan.id,
                        dateTime: dateFormat(lastScan.dateAndTime.startedOn, 'yyyy-mm-dd HH:MM'),
                        project: lastScan.project,
                        statistics: { high: 0, medium: 0, low: 0 },
                        newIssues: 0,
                        recurrentIssues: 0,
                        fixedIssues: 0,
                        totalUnresolvedIssues: 0,
                        urgent: 0,
                        toVerify: 0,
                        notExploitable: 0,
                        proposedNotExploitable: 0,
                        confirmed: 0,
                        high: { urgent: 0, toVerify: 0, notExploitable: 0, proposedNotExploitable: 0, confirmed: 0 },
                        medium: { urgent: 0, toVerify: 0, notExploitable: 0, proposedNotExploitable: 0, confirmed: 0 },
                        low: { urgent: 0, toVerify: 0, notExploitable: 0, proposedNotExploitable: 0, confirmed: 0 },
                    };

                    log.debug('LGV::getReportData  Go to getScanResults ...');
                    const scanResults = await getScanResults(lastScan.id);
                    log.debug('LGV::getReportData  Go to getQueriesForScan ...');
                    const scanQueries = await getQueriesForScan(lastScan.id);

                    const severity = lastScan.scanRiskSeverity;

                    combinedResults.loc += lastScan.scanState.linesOfCode;
                    combinedResults.scannedFiles += lastScan.scanState.filesCount;

                    if (combinedResults.overallRiskScore < severity) {
                        combinedResults.overallRiskScore = severity;
                    }

                    log.debug('LGV::getReportData  Go to scanResults.forEach ...');
                    scanResults.forEach((scanResult: IScanResult) => {
                        combinedResults[STATE_MAP[scanResult.State]]++;
                        combinedResults[STATUS_MAP[scanResult.ResultStatus]]++;
                        combinedResults[SEVERITY_MAP[scanResult.Severity]]++;

                        if (scanResult.ResultStatus !== 'Fixed') {
                            data.totalUnresolvedIssues++;
                        }

                        data.statistics[SEVERITY_MAP[scanResult.Severity]]++;
                        data[SEVERITY_MAP[scanResult.Severity]][STATE_MAP[scanResult.State]]++;
                        data[STATUS_MAP[scanResult.ResultStatus]]++;
                        data[STATE_MAP[scanResult.State]]++;
                    });

                    log.debug('LGV::getReportData  Go to scanQueries.forEach ...');
                    scanQueries.forEach((query: IQuery) => {
                        if (query && query.AmountOfResults > 0) {
                            if (!vulnerabilities[query.QueryName]) {
                                vulnerabilities[query.QueryName] = {
                                    name: query.QueryName.replace(/_/g, ' '),
                                    occurrences: 0,
                                    severityLabel: SEVERITY_MAP[query.Severity],
                                    severity: query.Severity,
                                };
                            }
                            vulnerabilities[query.QueryName].occurrences += query.AmountOfResults;
                        }
                    });
                    log.debug('LGV::getReportData  Go to resultsByScan ...');
                    resultsByScan.push(data);
                }
            })
        );
    } else {
        throw new Error('There is no projects with the specified names/name regex!');
    }

    if (Object.keys(vulnerabilities).length) {
        vulnerabilities = orderBy(vulnerabilities, ['severity', 'occurrences'], ['desc', 'desc']);
    } else {
        // this is simplify the mpty states on the templates
        vulnerabilities = [];
    }
    
     log.debug('LGV::getReportData  Go to return ...');
    
    return {
        combinedResults,
        resultsByScan,
        vulnerabilities,
    };
};
