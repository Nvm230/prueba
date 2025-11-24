import apiClient from './apiClient';

export interface Sticker {
  id: number;
  nombre?: string;
  global: boolean;
  owned: boolean;
  contentType: string;
  previewBase64?: string;
  fileId: number;
}

export const getStickers = async () => {
  const { data } = await apiClient.get<Sticker[]>('/api/stickers');
  return data;
};

export const createSticker = async (file: File, nombre?: string) => {
  const formData = new FormData();
  formData.append('file', file);
  if (nombre) {
    formData.append('nombre', nombre);
  }
  const { data } = await apiClient.post<Sticker>('/api/stickers', formData);
  return data;
};

export const deleteSticker = async (stickerId: number) => {
  await apiClient.delete(`/api/stickers/${stickerId}`);
};

export const publishSticker = async (stickerId: number) => {
  const { data } = await apiClient.post<Sticker>(`/api/stickers/${stickerId}/publish`, {});
  return data;
};

