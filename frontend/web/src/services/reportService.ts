import apiClient from './apiClient';

export type ReportType = 'EVENT' | 'PROFILE' | 'GROUP' | 'POST';

export interface CreateReportRequest {
  type: ReportType;
  targetId: number;
  reason: string;
  details: string;
}

export interface Report {
  id: number;
  type: ReportType;
  targetId: number;
  reportedBy: {
    id: number;
    name: string;
    email: string;
  };
  reason: string;
  details: string;
  status: 'PENDING' | 'REVIEWED' | 'RESOLVED' | 'DISMISSED';
  createdAt: string;
  reviewedAt?: string;
  reviewedBy?: {
    id: number;
    name: string;
  };
}

export const createReport = (data: CreateReportRequest, signal?: AbortSignal) =>
  apiClient
    .post<Report>('/api/reports', data, { signal })
    .then((res) => res.data);

export const getReports = (params?: { page?: number; size?: number; status?: string }, signal?: AbortSignal) =>
  apiClient
    .get<{ content: Report[]; totalElements: number; totalPages: number; number: number }>('/api/reports', {
      params,
      signal
    })
    .then((res) => res.data);

export const updateReportStatus = (reportId: number, status: 'REVIEWED' | 'RESOLVED' | 'DISMISSED', signal?: AbortSignal) =>
  apiClient
    .patch<Report>(`/api/reports/${reportId}/status`, { status }, { signal })
    .then((res) => res.data);

