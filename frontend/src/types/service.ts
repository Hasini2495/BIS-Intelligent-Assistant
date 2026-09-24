import { ProcessStep } from './certification';
import { Source } from './source';

export type ServiceCategory = 'certification' | 'standards' | 'testing' | 'hallmarking' | 'licensing' | 'consumer' | 'training' | 'other';

export interface BISService {
  id: string;
  name: string;
  category: ServiceCategory;
  shortDescription: string;
  description?: string;
  audience: ('industry' | 'msme' | 'startup' | 'consumer' | 'student' | 'researcher')[];
  howToAvail?: ProcessStep[];
  relatedServiceIds: string[];
  relatedStandardIds: string[];
  officialUrl?: string;
  sources: Source[];
  isDemo: boolean;
}
