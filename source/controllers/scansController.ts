import dateFormat from 'dateformat';
import { RestService, SoapService } from '../services';
import { config } from '../utils';
import { MARKED_STATUS_MAP, STATUS_TO_COMBINED_MAP, SEVERITY_MAP } from '../utils/constants';
import { IStringTMap, INumberTMap } from '../types';

export let combinedResults: IStringTMap<number> = {
    overallRiskScore: 0,
    newIssues: 0,
    recurrentIssues: 0,
    highVulnerabilities: 0,
    mediumVulnerabilities: 0,
    lowVulnerabilities: 0,
    toVerify: 0,
    urgent: 0,
    confirmed: 0,
    notExploitable: 0,
    proposedNotExploitable: 0,
    loc: 0,
    scannedFiles: 0,
    totalScannedProjects: 0,
};

export let resultsByProject: INumberTMap<any> = [];

const getSelectedProjects = async () => {
    const cx = await RestService.getInstance();
    const projects = await cx.getProjects();
    const pattern = config.projectNamesPattern;

    return projects.data.filter((project: any) => {
        return pattern
            ? project.name.toLowerCase().startsWith(pattern.toLowerCase())
            : // tslint:disable-next-line: no-bitwise
              ~config.projectNames.indexOf(project.name);
    });
};

const getLastScans = async (projectId: number) => {
    const cx = await RestService.getInstance();
    const scans = await cx.getScans(projectId, config.lastScansNumber || 1);
    return scans.data;
};

const getScanStatistics = async (id: number) => {
    const cx = await RestService.getInstance();
    const statistics = await cx.getScanStatistics(id);
    return statistics.data;
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

const setData = (project: any, scan: any, statistics: any, scanResults: any, scans: any) => {
    combinedResults.highVulnerabilities += statistics.highSeverity;
    combinedResults.mediumVulnerabilities += statistics.mediumSeverity;
    combinedResults.lowVulnerabilities += statistics.lowSeverity;
    combinedResults.loc += scan.scanState.linesOfCode;
    combinedResults.scannedFiles += scan.scanState.filesCount;

    const severity = scan.scanRiskSeverity;

    if (combinedResults.overallRiskScore < severity) {
        combinedResults.overallRiskScore = severity;
    }

    if (!resultsByProject[project.id]) {
        resultsByProject[project.id] = {
            id: project.id,
            name: project.name,
            lastScan: {
                id: scans[0].id,
                dateTime: dateFormat(scans[0].dateAndTime.startedOn, 'yyyy-mm-dd HH:MM'),
            },
            newIssues: 0,
            recurrentIssues: 0,
            fixedIssues: 0,
            totalUnresolvedIssues: 0,
            highSeverity: 0,
            mediumSeverity: 0,
            lowSeverity: 0,
            urgent: 0,
            toVerify: 0,
            notExploitable: 0,
            proposedNotExploitable: 0,
            confirmed: 0,
            high: { urgent: 0, toVerify: 0, notExploitable: 0, proposedNotExploitable: 0, confirmed: 0 },
            medium: { urgent: 0, toVerify: 0, notExploitable: 0, proposedNotExploitable: 0, confirmed: 0 },
            low: { urgent: 0, toVerify: 0, notExploitable: 0, proposedNotExploitable: 0, confirmed: 0 },
        };
    }

    resultsByProject[project.id].highSeverity += statistics.highSeverity;
    resultsByProject[project.id].mediumSeverity += statistics.mediumSeverity;
    resultsByProject[project.id].lowSeverity += statistics.lowSeverity;

    scanResults.forEach((result: any) => {
        combinedResults[MARKED_STATUS_MAP[result.State]]++;
        combinedResults[STATUS_TO_COMBINED_MAP[result.ResultStatus]]++;

        resultsByProject[project.id][STATUS_TO_COMBINED_MAP[result.ResultStatus]]++;
        resultsByProject[project.id][MARKED_STATUS_MAP[result.State]]++;
        resultsByProject[project.id][SEVERITY_MAP[result.Severity]][MARKED_STATUS_MAP[result.State]]++;

        if (result.ResultStatus === 'New' || result.ResultStatus !== 'Reoccured ') {
            resultsByProject[project.id].totalUnresolvedIssues++;
        }
    });
};

export const setProjectsData = async () => {
    const selectedProjects = await getSelectedProjects();

    combinedResults.totalScannedProjects = selectedProjects.length;

    if (selectedProjects.length) {
        return Promise.all(
            selectedProjects.map(async (project: any) => {
                const lastScans = await getLastScans(project.id);

                await Promise.all(
                    lastScans.map(async (scan: any) => {
                        const statistics = await getScanStatistics(scan.id); // highSeverity, mediumSeverity, lowSeverity,infoSeverity
                        const scanResults = await getScanResults(scan.id); // info for every result finded

                        setData(project, scan, statistics, scanResults, lastScans);
                    })
                );
            })
        );
    } else {
        throw new Error('There is no projects with the specified names/name pattern!');
    }
};
