import { useState, useEffect } from 'react';
import toast from 'react-hot-toast';
import { leaderboardService, LeaderboardEntry, UserRank } from '@/services';

export function useLeaderboard() {
    const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);
    const [userRank, setUserRank] = useState<UserRank | null>(null);
    const [isLoading, setIsLoading] = useState(false);

    const fetchGlobalLeaderboard = async () => {
        setIsLoading(true);
        try {
            const response = await leaderboardService.getGlobal();
            if (response.success && response.data) {
                setLeaderboard(response.data);
            }
        } catch (error: any) {
            const message = error.response?.data?.message || 'Failed to load leaderboard';
            toast.error(message);
        } finally {
            setIsLoading(false);
        }
    };

    const fetchUserRank = async () => {
        try {
            const response = await leaderboardService.getMyRank();
            if (response.success && response.data) {
                setUserRank(response.data);
            }
        } catch (error: any) {
            // Silently fail for user rank - not critical
            console.error('Failed to fetch user rank:', error);
        }
    };

    useEffect(() => {
        fetchGlobalLeaderboard();
    }, []);

    return {
        leaderboard,
        userRank,
        isLoading,
        fetchGlobalLeaderboard,
        fetchUserRank,
    };
}
