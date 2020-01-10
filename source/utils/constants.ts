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
    high: 0,
    medium: 0,
    low: 0,
    toVerify: 0,
    urgent: 0,
    confirmed: 0,
    notExploitable: 0,
    proposedNotExploitable: 0,
    loc: 0,
    scannedFiles: 0,
    totalScannedProjects: 0,
};
