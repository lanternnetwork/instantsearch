import type {
  InsightsMethodMap,
  InsightsClient as _InsightsClient,
} from 'search-insights';

export type {
  Init as InsightsInit,
  AddAlgoliaAgent as InsightsAddAlgoliaAgent,
  SetUserToken as InsightsSetUserToken,
  GetUserToken as InsightsGetUserToken,
  OnUserTokenChange as InsightsOnUserTokenChange,
} from 'search-insights';

export type InsightsClientMethod = keyof InsightsMethodMap;

export type InsightsClientPayload = {
  eventName: string;
  queryID: string;
  index: string;
  objectIDs: string[];
  positions?: number[];
};

type QueueItemMap = {
  [MethodName in keyof InsightsMethodMap]: [
    methodName: MethodName,
    ...args: InsightsMethodMap[MethodName]
  ];
};

type QueueItem = QueueItemMap[keyof QueueItemMap];

export type InsightsClient = _InsightsClient & {
  queue?: QueueItem[];
};
