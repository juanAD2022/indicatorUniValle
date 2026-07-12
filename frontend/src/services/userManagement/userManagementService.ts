import { api } from '@services/axiosConfig';
import type { User } from '@models/User';

export interface UserUpdateData {
  email?: string;
  role?: string;
}

export interface UserListResponse {
  users: User[];
  total: number;
}

export const getUsers = async (role?: string, isActive?: boolean): Promise<UserListResponse> => {
  const params: Record<string, string> = {};
  if (role) params.role = role;
  if (isActive !== undefined) params.is_active = String(isActive);

  const response = await api.get<UserListResponse>('/users', { params });
  return response.data;
};

export const getUserById = async (id: number): Promise<User> => {
  const response = await api.get<User>(`/users/${id}`);
  return response.data;
};

export const updateUser = async (id: number, data: UserUpdateData): Promise<User> => {
  const response = await api.put<User>(`/users/${id}`, data);
  return response.data;
};

export const toggleUserActive = async (id: number): Promise<User> => {
  const response = await api.patch<User>(`/users/${id}/toggle-active`);
  return response.data;
};
