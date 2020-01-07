import dateFormat from 'dateformat';
import { STATE_MAP, STATUS_MAP, SEVERITY_MAP, INITIAL_COMBINED_RESULTS, INITIAL_RESULTS_BY_PROJECT } from '../utils/constants';
import { RestService, SoapService } from '../services';
import { config } from '../utils';
import { IStringTMap } from '../types';

export let combinedResults: IStringTMap<number> = INITIAL_COMBINED_RESULTS;
export let resultsByProject: IStringTMap<any> = [];

const getSelectedProjects = async (namePattern: string) => {
    const cx = await RestService.getInstance();
    const projects = await cx.getProjects();

    return projects.data.filter((project: any) => project.name.toLowerCase().startsWith(namePattern.toLowerCase()));
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

const setData = (project: any, scanData: any) => {
    combinedResults.highVulnerabilities += scanData.highSeverity;
    combinedResults.mediumVulnerabilities += scanData.mediumSeverity;
    combinedResults.lowVulnerabilities += scanData.lowSeverity;
    combinedResults.loc += scanData.scanState.linesOfCode;
    combinedResults.scannedFiles += scanData.scanState.filesCount;

    const severity = scanData.scanRiskSeverity;
    if (combinedResults.overallRiskScore < severity) {
        combinedResults.overallRiskScore = severity;
    }

    const projectData = {
        id: project.id,
        name: project.name,
        lastScan: {
            id: scanData.id,
            dateTime: dateFormat(scanData.dateAndTime.startedOn, 'yyyy-mm-dd HH:MM'),
        },
        ...scanData,
        ...INITIAL_RESULTS_BY_PROJECT,
    };

    scanData.scanResults.forEach((result: any) => {
        combinedResults[STATE_MAP[result.state]]++;
        combinedResults[STATUS_MAP[result.status]]++;

        projectData[SEVERITY_MAP[result.severity]][STATE_MAP[result.state]]++;
        projectData[STATUS_MAP[result.status]]++;
        projectData[STATE_MAP[result.state]]++;

        if (result.status === 'New' || result.status !== 'Reoccured ') {
            projectData.totalUnresolvedIssues++;
        }
    });

    resultsByProject.push(projectData);
};

const fectchScanData = async (scanId: number) => {
    const statistics = await getScanStatistics(scanId); //highSeverity, mediumSeverity, lowSeverity,infoSeverity
    const scanResults: any = await getScanResults(scanId);

    return {
        ...statistics,
        scanResults: scanResults.map((result: any) => {
            return {
                status: result.ResultStatus,
                state: result.State,
                severity: result.Severity,
            };
        }),
    };
};

export const setProjectsData = async (namePattern: string) => {
    const selectedProjects = await getSelectedProjects(namePattern);

    combinedResults.totalScannedProjects = selectedProjects.length;

    if (selectedProjects.length) {
        await Promise.all(
            selectedProjects.map(async (project: any) => {
                const lastScans = await getLastScans(project.id);
                await Promise.all(
                    lastScans.map(async (scan: any) => {
                        const scanData = await fectchScanData(scan.id);
                        setData(project, { ...scan, ...scanData });
                    })
                );
            })
        );
    } else {
        throw new Error('There is no projects with the specified names/name pattern!');
    }
};
