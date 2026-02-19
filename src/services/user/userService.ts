import ApiService, { ApiResponse } from '../configs/ApiService';
import { User } from '../auth/authService';

class UserService {
    async getAll(): Promise<ApiResponse<User[]>> {
        return ApiService.get<User[]>('/users');
    }

    async delete(id: string): Promise<ApiResponse<void>> {
        return ApiService.delete<void>(`/users/${id}`);
    }
}

export default new UserService();
