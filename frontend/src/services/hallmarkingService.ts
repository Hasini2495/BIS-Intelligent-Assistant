import { apiClient } from '@/api/client';

export interface HallmarkingVerificationResult {
  huid: string;
  isFormatValid: boolean;
  isOfficiallyVerified: boolean;
  articleType?: string;
  purity?: string;
  ahcCenter?: string;
  jewellerName?: string;
  hallmarkingDate?: string;
  message: string;
}

export const hallmarkingService = {
  async verifyHuid(huid: string): Promise<HallmarkingVerificationResult> {
    return await apiClient.post<HallmarkingVerificationResult>('/hallmarking/verify', { huid });
  }
};
