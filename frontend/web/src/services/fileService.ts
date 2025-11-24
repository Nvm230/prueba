import apiClient from './apiClient';

export type FileScope = 'EVENT_CHAT' | 'GROUP_CHAT' | 'PRIVATE_CHAT' | 'SUPPORT' | 'STICKER' | 'OTHER';

export interface FileUploadResponse {
  id: number;
  fileName: string;
  contentType: string;
  sizeInBytes: number;
  previewBase64?: string;
}

export const uploadFile = async (file: File, scope: FileScope, scopeId?: number) => {
  const formData = new FormData();
  formData.append('file', file);
  formData.append('scope', scope);
  if (scopeId !== undefined) {
    formData.append('scopeId', String(scopeId));
  }

  const { data } = await apiClient.post<FileUploadResponse>('/api/files', formData, {
    headers: {
      'Content-Type': 'multipart/form-data'
    }
  });
  return data;
};

export const downloadFileById = async (fileId: number) => {
  const response = await apiClient.get<Blob>(`/api/files/${fileId}`, {
    responseType: 'blob'
  });
  return response.data;
};
















