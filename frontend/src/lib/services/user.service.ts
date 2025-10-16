import { apiService } from './api.service';
import type {
  User,
  CreateUserRequest,
  UpdateUserRequest,
  PaginationParams,
  PaginatedResponse,
} from '../types';

export const userService = {
  async getAll(params?: PaginationParams): Promise<PaginatedResponse<User>> {
    return apiService.get<PaginatedResponse<User>>(
      '/api/users',
      params as Record<string, string | number> | undefined
    );
  },

  async getById(id: string): Promise<User> {
    return apiService.get<User>(`/api/users/${id}`);
  },

  async create(data: CreateUserRequest): Promise<User> {
    return apiService.post<User, CreateUserRequest>('/api/users', data);
  },

  async update(id: string, data: UpdateUserRequest): Promise<User> {
    return apiService.patch<User, UpdateUserRequest>(`/api/users/${id}`, data);
  },

  async delete(id: string): Promise<void> {
    return apiService.delete<void>(`/api/users/${id}`);
  },
};
