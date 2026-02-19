import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import { useAuthContext } from '@/context/context';
import { authService, RegisterInput, LoginInput } from '@/services';

export function useAuth() {
    const { user, isAuthenticated, login: contextLogin, logout: contextLogout } = useAuthContext();
    const [isLoading, setIsLoading] = useState(false);
    const navigate = useNavigate();

    const register = async (data: RegisterInput) => {
        setIsLoading(true);
        try {
            const response = await authService.register(data);
            if (response.success && response.data) {
                const { user, accessToken, refreshToken } = response.data;
                contextLogin(user, accessToken, refreshToken);
                toast.success('Registration successful! Welcome to PromptCraft.');
                navigate('/');
            } else {
                toast.error(response.message || 'Registration failed');
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Registration failed. Please try again.';
            toast.error(message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const login = async (data: LoginInput) => {
        setIsLoading(true);
        try {
            const response = await authService.login(data);
            if (response.success && response.data) {
                const { user, accessToken, refreshToken } = response.data;
                contextLogin(user, accessToken, refreshToken);
                toast.success(`Welcome back, ${user.username}!`);
                navigate('/');
            } else {
                toast.error(response.message || 'Login failed');
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Login failed. Please try again.';
            toast.error(message);
            throw error;
        } finally {
            setIsLoading(false);
        }
    };

    const logout = async () => {
        try {
            await authService.logout();
            contextLogout();
            toast.success('Logged out successfully');
            navigate('/login');
        } catch (error) {
            // Even if API call fails, logout locally
            contextLogout();
            navigate('/login');
        }
    };

    return {
        user,
        isAuthenticated,
        isLoading,
        register,
        login,
        logout,
    };
}
