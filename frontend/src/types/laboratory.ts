import { ISODateString } from './common';
import { Source } from './source';

export type RecognitionType = 'bis_recognized' | 'nabl_accredited' | 'in_house' | 'unknown';

export interface LabContact {
  phone?: string;
  email?: string;
  website?: string;
}

export interface Laboratory {
  id: string;
  name: string;
  city?: string;
  state?: string;
  region?: string;
  recognitionType?: RecognitionType;
  recognitionNumber?: string;
  validUntil?: ISODateString;
  scopes: string[];
  disciplines: string[];
  contact?: LabContact;
  sources: Source[];
  isDemo: boolean;
  dataDisclaimerKey: string;
}
