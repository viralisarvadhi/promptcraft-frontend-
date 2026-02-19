import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context/context';
import { useAppStore } from '@/store/hooks';
import { Challenge } from '@/services';
import Header from '@/components/Header';
import {
    CATEGORIES,
    DIFFICULTIES,
    DIFFICULTY_COLORS,
    CATEGORY_COLORS,
    ROUTES,
} from '@/utils/constants';
import toast from 'react-hot-toast';

export default function HomePage() {
    const navigate = useNavigate();
    const { isAuthenticated } = useAuthContext();
    const { challenges, setSelectedChallenge, fetchChallenges } = useAppStore();
    const [isLoading, setIsLoading] = useState(false);
    const [filters, setFilters] = useState({
        category: '',
        difficulty: '',
    });

    useEffect(() => {
        loadChallenges();
    }, [filters]);

    const loadChallenges = async () => {
        setIsLoading(true);
        try {
            const filterParams: { category?: string; difficulty?: string } = {};
            if (filters.category) filterParams.category = filters.category;
            if (filters.difficulty) filterParams.difficulty = filters.difficulty;
            await fetchChallenges(filterParams);
        } catch (error) {
            toast.error('Failed to load challenges');
        } finally {
            setIsLoading(false);
        }
    };

    const handleChallengeClick = (challenge: Challenge) => {
        if (!isAuthenticated) {
            toast.error('Please sign in to attempt challenges');
            navigate(ROUTES.LOGIN);
            return;
        }
        setSelectedChallenge(challenge);
        navigate(`/challenge/${challenge.id}`);
    };

    const filteredChallenges = challenges;

    return (
        <div className="min-h-screen bg-gray-50">
            <Header />

            {/* Hero Section */}
            <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white py-16">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
                    <h2 className="text-4xl font-bold mb-4">Master the Art of Prompt Engineering</h2>
                    <p className="text-xl text-indigo-100 mb-8">
                        Practice writing effective prompts and get AI-powered feedback
                    </p>
                    {!isAuthenticated && (
                        <Link
                            to={ROUTES.REGISTER}
                            className="inline-block px-8 py-3 bg-white text-indigo-600 rounded-lg font-semibold hover:bg-gray-100 transition-colors"
                        >
                            Get Started
                        </Link>
                    )}
                </div>
            </div>

            {/* Filters */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
                    <h3 className="text-lg font-semibold text-gray-900 mb-4">Filter Challenges</h3>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Category
                            </label>
                            <select
                                value={filters.category}
                                onChange={(e) =>
                                    setFilters((prev) => ({ ...prev, category: e.target.value }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">All Categories</option>
                                {CATEGORIES.map((cat) => (
                                    <option key={cat} value={cat}>
                                        {cat}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                                Difficulty
                            </label>
                            <select
                                value={filters.difficulty}
                                onChange={(e) =>
                                    setFilters((prev) => ({ ...prev, difficulty: e.target.value }))
                                }
                                className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                            >
                                <option value="">All Difficulties</option>
                                {DIFFICULTIES.map((diff) => (
                                    <option key={diff} value={diff}>
                                        {diff}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </div>

                {/* Challenges Grid */}
                {isLoading ? (
                    <div className="flex justify-center py-12">
                        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                    </div>
                ) : filteredChallenges.length === 0 ? (
                    <div className="text-center py-12">
                        <p className="text-gray-600">No challenges found</p>
                    </div>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {filteredChallenges.map((challenge) => (
                            <div
                                key={challenge.id}
                                onClick={() => handleChallengeClick(challenge)}
                                className="bg-white rounded-lg shadow-sm hover:shadow-md transition-shadow cursor-pointer p-6"
                            >
                                <div className="flex items-start justify-between mb-3">
                                    <h3 className="text-lg font-semibold text-gray-900 flex-1">
                                        {challenge.title}
                                    </h3>
                                </div>

                                <div className="flex flex-wrap gap-2 mb-4">
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-medium ${CATEGORY_COLORS[challenge.category as keyof typeof CATEGORY_COLORS].bg
                                            } ${CATEGORY_COLORS[challenge.category as keyof typeof CATEGORY_COLORS].text}`}
                                    >
                                        {challenge.category}
                                    </span>
                                    <span
                                        className={`px-2 py-1 rounded text-xs font-medium ${DIFFICULTY_COLORS[challenge.difficulty as keyof typeof DIFFICULTY_COLORS].bg
                                            } ${DIFFICULTY_COLORS[challenge.difficulty as keyof typeof DIFFICULTY_COLORS].text}`}
                                    >
                                        {challenge.difficulty}
                                    </span>
                                </div>

                                <p className="text-sm text-gray-600 mb-4 line-clamp-2">
                                    {challenge.instruction}
                                </p>

                                <div className="flex items-center justify-between text-sm text-gray-500">
                                    <span>~{challenge.estimatedMinutes} min</span>
                                    <span>{challenge.tags.length} tags</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
