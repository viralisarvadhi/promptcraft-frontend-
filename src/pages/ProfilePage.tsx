import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context/context';
import { evaluationService, Attempt } from '@/services';
import Header from '@/components/Header';
import { ROUTES } from '@/utils/constants';
import { getGradeInfo, formatDate } from '@/utils/commonFunctions/masterCommonFunctions';
import toast from 'react-hot-toast';

export default function ProfilePage() {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const [attempts, setAttempts] = useState<Attempt[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        loadAttempts();
    }, [page]);

    const loadAttempts = async () => {
        setIsLoading(true);
        try {
            const response = await evaluationService.getMyAttempts(page, 10);
            if (response.success && response.data) {
                setAttempts(response.data);
                if (response.meta) {
                    setTotalPages(response.meta.totalPages);
                }
            }
        } catch (error) {
            toast.error('Failed to load history');
        } finally {
            setIsLoading(false);
        }
    };

    const handleAttemptClick = (attemptId: string) => {
        navigate(`/result/${attemptId}`);
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header showBackButton backTo={ROUTES.HOME} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                {/* User Profile Section */}
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                            <div className="w-20 h-20 bg-indigo-100 rounded-full flex items-center justify-center">
                                <span className="text-3xl font-bold text-indigo-600">
                                    {user?.username.charAt(0).toUpperCase()}
                                </span>
                            </div>
                            <div>
                                <h2 className="text-2xl font-bold text-gray-900">
                                    {user?.username}
                                </h2>
                                <p className="text-gray-600">{user?.email}</p>
                                <div className="flex items-center gap-4 mt-2 text-sm text-gray-500">
                                    <span>Member since {user?.createdAt ? formatDate(user.createdAt) : 'N/A'}</span>
                                </div>
                            </div>
                        </div>
                        <div className="text-right">
                            <div className="grid grid-cols-3 gap-6">
                                <div>
                                    <div className="text-3xl font-bold text-indigo-600">
                                        {user?.totalAttempts || 0}
                                    </div>
                                    <div className="text-sm text-gray-600">Total Attempts</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-indigo-600">
                                        {user?.bestScore.toFixed(1) || '0.0'}
                                    </div>
                                    <div className="text-sm text-gray-600">Best Score</div>
                                </div>
                                <div>
                                    <div className="text-3xl font-bold text-indigo-600">
                                        {user?.averageScore.toFixed(1) || '0.0'}
                                    </div>
                                    <div className="text-sm text-gray-600">Average Score</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">My Attempt History</h2>
                    <p className="text-gray-600 mt-2">
                        Review your past submissions and track your progress
                    </p>
                </div>

                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : attempts.length === 0 ? (
                    <div className="bg-white rounded-lg shadow-sm p-12 text-center">
                        <p className="text-gray-600 mb-4">No attempts yet</p>
                        <Link
                            to={ROUTES.HOME}
                            className="inline-block px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                        >
                            Start Your First Challenge
                        </Link>
                    </div>
                ) : (
                    <>
                        <div className="space-y-4">
                            {attempts.map((attempt) => {
                                const gradeInfo = getGradeInfo(attempt.totalScore);
                                return (
                                    <div
                                        key={attempt.id}
                                        onClick={() => handleAttemptClick(attempt.id)}
                                        className="bg-white rounded-lg shadow-sm p-6 hover:shadow-md transition-shadow cursor-pointer"
                                    >
                                        <div className="flex items-start justify-between">
                                            <div className="flex-1">
                                                <div className="flex items-center gap-3 mb-2">
                                                    <h3 className="text-lg font-semibold text-gray-900">
                                                        Challenge #{attempt.challengeId.slice(0, 8)}
                                                    </h3>
                                                    <span
                                                        className={`px-3 py-1 rounded-full text-sm font-bold ${gradeInfo.bgColor} ${gradeInfo.color}`}
                                                    >
                                                        {gradeInfo.label}
                                                    </span>
                                                </div>
                                                <p className="text-gray-600 text-sm mb-3 line-clamp-2">
                                                    {attempt.promptText}
                                                </p>
                                                <div className="flex items-center gap-4 text-sm text-gray-500">
                                                    <span>{formatDate(attempt.createdAt)}</span>
                                                    <span>•</span>
                                                    <span>{attempt.wordCount} words</span>
                                                    <span>•</span>
                                                    <span>
                                                        {attempt.evaluatorType === 'ai'
                                                            ? 'AI Evaluated'
                                                            : 'Heuristic'}
                                                    </span>
                                                </div>
                                            </div>
                                            <div className="text-right ml-6">
                                                <div className="text-3xl font-bold text-indigo-600">
                                                    {attempt.totalScore.toFixed(1)}
                                                </div>
                                                <div className="text-sm text-gray-500">/ 10.0</div>
                                            </div>
                                        </div>

                                        {/* Dimension Scores Mini */}
                                        <div className="mt-4 pt-4 border-t border-gray-100">
                                            <div className="grid grid-cols-5 gap-2 text-xs">
                                                <div className="text-center">
                                                    <div className="font-semibold text-gray-700">
                                                        Clarity
                                                    </div>
                                                    <div className="text-indigo-600 font-bold">
                                                        {attempt.clarityScore.toFixed(1)}
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="font-semibold text-gray-700">
                                                        Specificity
                                                    </div>
                                                    <div className="text-indigo-600 font-bold">
                                                        {attempt.specificityScore.toFixed(1)}
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="font-semibold text-gray-700">
                                                        Context
                                                    </div>
                                                    <div className="text-indigo-600 font-bold">
                                                        {attempt.contextScore.toFixed(1)}
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="font-semibold text-gray-700">
                                                        Structure
                                                    </div>
                                                    <div className="text-indigo-600 font-bold">
                                                        {attempt.structureScore.toFixed(1)}
                                                    </div>
                                                </div>
                                                <div className="text-center">
                                                    <div className="font-semibold text-gray-700">
                                                        Complete
                                                    </div>
                                                    <div className="text-indigo-600 font-bold">
                                                        {attempt.completenessScore.toFixed(1)}
                                                    </div>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                );
                            })}
                        </div>

                        {/* Pagination */}
                        {totalPages > 1 && (
                            <div className="mt-8 flex justify-center gap-2">
                                <button
                                    onClick={() => setPage((p) => Math.max(1, p - 1))}
                                    disabled={page === 1}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Previous
                                </button>
                                <span className="px-4 py-2 text-gray-700">
                                    Page {page} of {totalPages}
                                </span>
                                <button
                                    onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                                    disabled={page === totalPages}
                                    className="px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                                >
                                    Next
                                </button>
                            </div>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
