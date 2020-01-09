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

export interface IScanDateTime {
    startedOn: string;
    finishedOn: string;
    engineStartedOn: string;
    engineFinishedOn: string;
}

export interface IScanState {
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
    scanState: IscanSate;
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
