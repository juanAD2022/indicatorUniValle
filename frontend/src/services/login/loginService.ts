import { api } from '@services/axiosConfig';
import type { LoginRequest, LoginResponse } from '@models/User';

export const loginService = async (credentials: LoginRequest): Promise<LoginResponse> => {
  const response = await api.post<LoginResponse>('/login', credentials);
  return response.data;
};
