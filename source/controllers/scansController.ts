import dateFormat from 'dateformat';
import orderBy from 'lodash/orderBy';
import { INITIAL_COMBINED_RESULTS, SEVERITY_MAP, STATUS_MAP, STATE_MAP } from '../utils/constants';
import { RestService, SoapService } from '../services';
import { IStringTMap, IProject, IScan, IScanResult } from '../types';

export let combinedResults = INITIAL_COMBINED_RESULTS;
export let resultsByScan: IStringTMap<any> = [];
export let vulnerabilities: IStringTMap<any> = {};

const getSelectedProjects = async (namePattern: string) => {
    const cx = await RestService.getInstance();
    const projects = await cx.getProjects();

    return projects.data.filter((project: IProject) => project.name.toLowerCase().startsWith(namePattern.toLowerCase()));
};

const getLastScan = async (projectId: number) => {
    const cx = await RestService.getInstance();
    const scan = await cx.getLastScan(projectId);
    return scan.data[0];
};

const getScanResults = (scanId: number) => {
    return new Promise(async resolve => {
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

const getQueriesForScan = (scanId: number) => {
    return new Promise(async resolve => {
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

export const setProjectsData = async (namePattern: string) => {
    const selectedProjects: [IProject] = await getSelectedProjects(namePattern);

    combinedResults.totalScannedProjects = selectedProjects.length;

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

                    const scanResults: any = await getScanResults(lastScan.id);
                    const scanQueries: any = await getQueriesForScan(lastScan.id);

                    const severity = lastScan.scanRiskSeverity;

                    combinedResults.loc += lastScan.scanState.linesOfCode;
                    combinedResults.scannedFiles += lastScan.scanState.filesCount;

                    if (combinedResults.overallRiskScore < severity) {
                        combinedResults.overallRiskScore = severity;
                    }

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

                    scanQueries.forEach((query: any) => {
                        if (query.AmountOfResults > 0) {
                            if (!vulnerabilities[query.QueryId]) {
                                vulnerabilities[query.QueryId] = {
                                    name: query.QueryName.replace(/_/g, ' '),
                                    occurrences: 0,
                                    severityLabel: SEVERITY_MAP[query.Severity],
                                    severity: query.Severity,
                                };
                            }

                            vulnerabilities[query.QueryId].occurrences += query.AmountOfResults;
                        }
                    });

                    vulnerabilities = orderBy(vulnerabilities, ['severity', 'occurrences'], ['desc', 'desc']);

                    resultsByScan.push(data);
                } else {
                    throw new Error('There isnt any finished scan for the specified project(s)!');
                }
            })
        );
    } else {
        throw new Error('There is no projects with the specified names/name pattern!');
    }
};
