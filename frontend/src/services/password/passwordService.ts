import { api } from '@services/axiosConfig';
import type { ForgotPasswordRequest, ResetPasswordRequest } from '@models/User';

export const forgotPassword = async (data: ForgotPasswordRequest): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>('/forgot-password', data);
  return response.data;
};

export const resetPassword = async (data: ResetPasswordRequest): Promise<{ message: string }> => {
  const response = await api.post<{ message: string }>('/reset-password', data);
  return response.data;
};
