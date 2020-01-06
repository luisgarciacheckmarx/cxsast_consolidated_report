import { IStringTMap, INumberTMap } from '../types';

export const MARKED_STATUS_MAP: INumberTMap<string> = {
  0: 'toVerify',
  1: 'notExploitable',
  2: 'confirmed',
  3: 'urgent',
  4: 'proposedNotExploitable',
}

export const SEVERITY_MAP: INumberTMap<string> = {
  0: 'info',
  1: 'low',
  2: 'medium',
  3: 'high',
}

export const STATUS_TO_COMBINED_MAP: IStringTMap<string> = {
  New: 'newIssues',
  Fixed: 'fixedIssues',
  Recurred: 'recurrentIssues',
}
