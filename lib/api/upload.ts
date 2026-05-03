import { api } from './api';

export interface FileGeneral {
  public_id: string;
  url: string;
}

const UPLOAD_BASE_URL = '/upload';

export type UploadFileParams = {
  file: File | Blob;
  fieldName?: string;
  filename?: string;
  folder?: string;
};

async function uploadFile({ file, fieldName = 'file', filename, folder }: UploadFileParams) {
  const formData = new FormData();

  if (typeof filename === 'string' && filename.length > 0) {
    formData.append(fieldName, file, filename);
  } else {
    formData.append(fieldName, file);
  }

  if (typeof folder === 'string' && folder.length > 0) {
    formData.append('folder', folder);
  }

  return api.postForm<FileGeneral>(`${UPLOAD_BASE_URL}/file`, formData);
}

export const uploadService = {
  uploadFile,
};
