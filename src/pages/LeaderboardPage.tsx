import { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuthContext } from '@/context/context';
import { useLeaderboard } from '@/hooks/useLeaderboard';
import Header from '@/components/Header';
import { ROUTES } from '@/utils/constants';

export default function LeaderboardPage() {
    const { isAuthenticated } = useAuthContext();
    const { leaderboard, userRank, isLoading, fetchGlobalLeaderboard, fetchUserRank } =
        useLeaderboard();

    useEffect(() => {
        if (isAuthenticated) {
            fetchUserRank();
        }
    }, [isAuthenticated]);

    return (
        <div className="min-h-screen bg-gray-50">
            <Header showBackButton backTo={ROUTES.HOME} />

            <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Global Leaderboard</h2>
                    <p className="text-gray-600 mt-2">
                        Top prompt engineers ranked by their best scores
                    </p>
                </div>

                {/* User Rank Card */}
                {isAuthenticated && userRank && (
                    <div className="bg-gradient-to-r from-indigo-600 to-purple-600 rounded-lg shadow-sm p-6 mb-8 text-white">
                        <div className="flex items-center justify-between">
                            <div>
                                <h3 className="text-lg font-semibold mb-1">Your Rank</h3>
                                <p className="text-indigo-100">
                                    Keep practicing to climb the leaderboard!
                                </p>
                            </div>
                            <div className="text-right">
                                <div className="text-4xl font-bold">#{userRank.rank}</div>
                                <div className="text-indigo-100">of {userRank.total}</div>
                            </div>
                        </div>
                    </div>
                )}

                {/* Leaderboard Table */}
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : leaderboard.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <p className="text-gray-600">No leaderboard data yet</p>
                    </div>
                ) : (
                    <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                        <table className="min-w-full divide-y divide-gray-200">
                            <thead className="bg-gray-50">
                                <tr>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Rank
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        User
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Best Score
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Avg Score
                                    </th>
                                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                        Attempts
                                    </th>
                                </tr>
                            </thead>
                            <tbody className="bg-white divide-y divide-gray-200">
                                {leaderboard.map((entry) => {
                                    const isTopThree = entry.rank <= 3;
                                    const rankColors = {
                                        1: 'text-yellow-600 font-bold',
                                        2: 'text-gray-400 font-bold',
                                        3: 'text-orange-600 font-bold',
                                    };

                                    return (
                                        <tr
                                            key={entry.id}
                                            className={
                                                isTopThree ? 'bg-indigo-50' : 'hover:bg-gray-50'
                                            }
                                        >
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div
                                                    className={`text-lg ${isTopThree
                                                        ? rankColors[
                                                        entry.rank as keyof typeof rankColors
                                                        ]
                                                        : 'text-gray-900'
                                                        }`}
                                                >
                                                    {entry.rank === 1 && '🥇'}
                                                    {entry.rank === 2 && '🥈'}
                                                    {entry.rank === 3 && '🥉'}
                                                    {entry.rank > 3 && `#${entry.rank}`}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-medium text-gray-900">
                                                    {entry.username}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm font-bold text-indigo-600">
                                                    {entry.bestScore.toFixed(1)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-900">
                                                    {entry.averageScore.toFixed(1)}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 whitespace-nowrap">
                                                <div className="text-sm text-gray-500">
                                                    {entry.totalAttempts}
                                                </div>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* CTA for non-authenticated users */}
                {!isAuthenticated && (
                    <div className="mt-8 bg-white rounded-lg shadow-sm p-8 text-center">
                        <h3 className="text-xl font-bold text-gray-900 mb-2">
                            Join the Competition
                        </h3>
                        <p className="text-gray-600 mb-6">
                            Sign up to start practicing and see your name on the leaderboard
                        </p>
                        <Link
                            to={ROUTES.REGISTER}
                            className="inline-block px-8 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                        >
                            Get Started
                        </Link>
                    </div>
                )}
            </div>
        </div>
    );
}
