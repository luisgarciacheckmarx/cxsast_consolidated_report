import { INumberTMap, IStringTMap } from '../types';

export const STATE_MAP: INumberTMap<string> = {
    0: 'toVerify',
    1: 'notExploitable',
    2: 'confirmed',
    3: 'urgent',
    4: 'proposedNotExploitable',
};

export const SEVERITY_MAP: INumberTMap<string> = {
    0: 'info',
    1: 'low',
    2: 'medium',
    3: 'high',
};

export const STATUS_MAP: IStringTMap<string> = {
    New: 'newIssues',
    Fixed: 'fixedIssues',
    Reoccured: 'recurrentIssues',
};

export const INITIAL_COMBINED_RESULTS: IStringTMap<number> = {
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

export const INITIAL_RESULTS_BY_PROJECT: IStringTMap<any> = {
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
