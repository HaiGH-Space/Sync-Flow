import { api, ApiResponse } from "./api";

const USER_BASE_URL = "/users";

export interface UserProfile {
  id: string;
  name: string;
  email: string;
  emailVerified: boolean;
  image?: string;
}

export type UpdateMyAvatarParams =
  | {
      file: File | Blob;
      fieldName?: string;
      filename?: string;
    }
  | {
      image: string | null;
    };

async function getUserProfile(): Promise<ApiResponse<UserProfile>> {
  return await api.get<UserProfile>(`${USER_BASE_URL}/me`);
}

async function updateMyAvatar(params: UpdateMyAvatarParams): Promise<ApiResponse<UserProfile>> {
  const endpoint = `${USER_BASE_URL}/me/avatar`;

  if ("file" in params) {
    const formData = new FormData();
    const fieldName = params.fieldName ?? "file";
    if (params.filename) {
      formData.append(fieldName, params.file, params.filename);
    } else {
      formData.append(fieldName, params.file);
    }

    return await api.postForm<UserProfile>(endpoint, formData);
  }

  return await api.post<UserProfile>(endpoint, { image: params.image });
}

export const userService = {
  getUserProfile,
  updateMyAvatar,
};
