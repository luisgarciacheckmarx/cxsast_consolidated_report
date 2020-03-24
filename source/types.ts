export interface IStringTMap<T> {
    [key: string]: T;
}
export interface INumberTMap<T> {
    [key: number]: T;
}

export interface IProject {
    id: number;
    teamId: string;
    name: string;
    isPublic: boolean;
    customFields: [any];
    links: [any];
}

export interface IScanResult {
    QueryId: string;
    PathId: string;
    SourceFolder: string;
    SourceFile: string;
    SourceLine: string;
    SourceObject: string;
    DestFolder: string;
    DestFile: string;
    DestLine: string;
    NumberOfNodes: 16;
    DestObject: string;
    Comment: string;
    State: number;
    Severity: number;
    AssignedUser: string;
    ResultStatus: string;
    IssueTicketID: string;
    QueryVersionCode: string;
}

interface IScanDateTime {
    startedOn: string;
    finishedOn: string;
    engineStartedOn: string;
    engineFinishedOn: string;
}

interface IScanState {
    path: string;
    sourceId: string;
    filesCount: number;
    linesOfCode: number;
    failedLinesOfCode: number;
    cxVersion: string;
    languageStateCollection: [any];
}

export interface IScan {
    id: number;
    project: IProject;
    status: any;
    scanType: any;
    comment: string;
    dateAndTime: IScanDateTime;
    resultsStatistics: any;
    scanState: IScanState;
    owner: string;
    origin: string;
    initiatorName: string;
    owningTeamId: string;
    isPublic: boolean;
    isLocked: boolean;
    isIncremental: boolean;
    scanRisk: number;
    scanRiskSeverity: number;
    engineServer: any;
    finishedScanStatus: any;
    partialScanReasons: any;
}

export interface IQuery {
    QueryName: string;
    QueryId: number;
    AmountOfResults: number;
    Severity: number;
}

export interface IVulnerability {
    name: string;
    ocurrences: number;
    severity: string;
}

export interface ICombinedResults {
    overallRiskScore: number;
    newIssues: number;
    recurrentIssues: number;
    high: number;
    medium: number;
    low: number;
    toVerify: number;
    urgent: number;
    confirmed: number;
    notExploitable: number;
    proposedNotExploitable: number;
    loc: number;
    scannedFiles: number;
    totalScannedProjects: number;
}

export interface IConsolidatedData {
    combinedResults: IStringTMap<number>;
    resultsByScan: IStringTMap<number>;
    vulnerabilities: IStringTMap<IVulnerability>;
}
