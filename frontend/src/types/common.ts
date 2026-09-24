export type UUID = string;
export type ISODateString = string;
export type RelevanceLevel = 'high' | 'medium' | 'low';

export interface Paginated<T> {
  items: T[];
  page: number;
  pageSize: number;
  total: number;
  hasMore: boolean;
}

export interface ApiErrorBody {
  code: string;
  messageKey: string;
  detail?: string;
  correlationId?: string;
}
