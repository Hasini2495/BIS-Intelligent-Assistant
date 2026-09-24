import { SourceRef } from './certification';

export type TestType = 'mechanical' | 'chemical' | 'electrical' | 'safety' | 'performance' | 'dimensional' | 'environmental' | 'other';

export interface TestingRequirement {
  id: string;
  testName: string;
  description?: string;
  testType: TestType;
  applicableProductCategories: string[];
  standardId?: string;
  standardNumber?: string;
  clause?: string;
  method?: string;
  acceptanceCriteria?: string;
  sourceRef?: SourceRef;
  isDemo: boolean;
}
