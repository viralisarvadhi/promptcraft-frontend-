import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context/context';
import { challengeService, userService, Challenge, User } from '@/services';
import Header from '@/components/Header';
import { ROUTES, CATEGORIES, DIFFICULTIES, CATEGORY_COLORS, DIFFICULTY_COLORS } from '@/utils/constants';
import { formatDate } from '@/utils/commonFunctions/masterCommonFunctions';
import toast from 'react-hot-toast';

type TabType = 'challenges' | 'users';

export default function AdminDashboardPage() {
    const navigate = useNavigate();
    const { user } = useAuthContext();
    const [activeTab, setActiveTab] = useState<TabType>('challenges');

    // Challenges state
    const [challenges, setChallenges] = useState<Challenge[]>([]);
    const [isLoadingChallenges, setIsLoadingChallenges] = useState(true);
    const [showChallengeModal, setShowChallengeModal] = useState(false);
    const [editingChallenge, setEditingChallenge] = useState<Challenge | null>(null);

    // Users state
    const [users, setUsers] = useState<User[]>([]);
    const [isLoadingUsers, setIsLoadingUsers] = useState(true);

    const [formData, setFormData] = useState({
        title: '',
        category: '',
        difficulty: '',
        instruction: '',
        tips: '',
        examplePrompt: '',
        tags: '',
        estimatedMinutes: 10,
    });

    useEffect(() => {
        if (user?.role !== 'admin') {
            navigate(ROUTES.HOME);
            return;
        }
        loadChallenges();
        loadUsers();
    }, [user]);

    const loadChallenges = async () => {
        setIsLoadingChallenges(true);
        try {
            const response = await challengeService.getAll();
            if (response.success && response.data) {
                setChallenges(response.data);
            }
        } catch (error: any) {
            console.error('Error loading challenges:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to load challenges';
            toast.error(errorMessage);
        } finally {
            setIsLoadingChallenges(false);
        }
    };

    const loadUsers = async () => {
        setIsLoadingUsers(true);
        try {
            const response = await userService.getAll();
            if (response.success && response.data) {
                setUsers(response.data);
            }
        } catch (error: any) {
            console.error('Error loading users:', error);
            const errorMessage = error.response?.data?.message || error.message || 'Failed to load users';
            toast.error(errorMessage);
        } finally {
            setIsLoadingUsers(false);
        }
    };

    const handleAddNew = () => {
        setEditingChallenge(null);
        setFormData({
            title: '',
            category: '',
            difficulty: '',
            instruction: '',
            tips: '',
            examplePrompt: '',
            tags: '',
            estimatedMinutes: 10,
        });
        setShowChallengeModal(true);
    };

    const handleEdit = (challenge: Challenge) => {
        setEditingChallenge(challenge);
        setFormData({
            title: challenge.title,
            category: challenge.category,
            difficulty: challenge.difficulty,
            instruction: challenge.instruction,
            tips: challenge.tips.join('\n'),
            examplePrompt: challenge.examplePrompt,
            tags: challenge.tags.join(', '),
            estimatedMinutes: challenge.estimatedMinutes,
        });
        setShowChallengeModal(true);
    };

    const handleDeleteChallenge = async (id: string) => {
        if (!confirm('Are you sure you want to delete this challenge?')) return;

        try {
            const response = await challengeService.delete(id);
            if (response.success) {
                toast.success('Challenge deleted successfully');
                loadChallenges();
            }
        } catch (error) {
            toast.error('Failed to delete challenge');
        }
    };

    const handleDeleteUser = async (id: string, username: string) => {
        if (!confirm(`Are you sure you want to delete user "${username}"? This action cannot be undone.`)) return;

        try {
            const response = await userService.delete(id);
            if (response.success) {
                toast.success('User deleted successfully');
                loadUsers();
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to delete user');
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();

        const challengeData = {
            title: formData.title,
            category: formData.category,
            difficulty: formData.difficulty,
            instruction: formData.instruction,
            tips: formData.tips.split('\n').filter(t => t.trim()),
            examplePrompt: formData.examplePrompt,
            tags: formData.tags.split(',').map(t => t.trim()).filter(t => t),
            estimatedMinutes: formData.estimatedMinutes,
            isActive: true,
        };

        try {
            if (editingChallenge) {
                const response = await challengeService.update(editingChallenge.id, challengeData);
                if (response.success) {
                    toast.success('Challenge updated successfully');
                    setShowChallengeModal(false);
                    loadChallenges();
                }
            } else {
                const response = await challengeService.create(challengeData as any);
                if (response.success) {
                    toast.success('Challenge created successfully');
                    setShowChallengeModal(false);
                    loadChallenges();
                }
            }
        } catch (error: any) {
            toast.error(error.response?.data?.message || 'Failed to save challenge');
        }
    };

    return (
        <div className="min-h-screen bg-gray-50">
            <Header showBackButton backTo={ROUTES.HOME} />

            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
                <div className="mb-8">
                    <h2 className="text-3xl font-bold text-gray-900">Admin Dashboard</h2>
                    <p className="text-gray-600 mt-2">Manage challenges and users</p>
                </div>

                {/* Tabs */}
                <div className="border-b border-gray-200 mb-6">
                    <nav className="-mb-px flex space-x-8">
                        <button
                            onClick={() => setActiveTab('challenges')}
                            className={`${activeTab === 'challenges'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            Challenges
                        </button>
                        <button
                            onClick={() => setActiveTab('users')}
                            className={`${activeTab === 'users'
                                ? 'border-indigo-500 text-indigo-600'
                                : 'border-transparent text-gray-500 hover:text-gray-700 hover:border-gray-300'
                                } whitespace-nowrap py-4 px-1 border-b-2 font-medium text-sm transition-colors`}
                        >
                            Users
                        </button>
                    </nav>
                </div>

                {/* Challenges Tab */}
                {activeTab === 'challenges' && (
                    <div>
                        <div className="flex justify-end mb-6">
                            <button
                                onClick={handleAddNew}
                                className="px-6 py-3 bg-indigo-600 text-white rounded-lg font-semibold hover:bg-indigo-700 transition-colors"
                            >
                                + Add New Challenge
                            </button>
                        </div>

                        {isLoadingChallenges ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Title
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Category
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Difficulty
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Est. Time
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {challenges.map((challenge) => (
                                            <tr key={challenge.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {challenge.title}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${CATEGORY_COLORS[challenge.category as keyof typeof CATEGORY_COLORS].bg
                                                            } ${CATEGORY_COLORS[challenge.category as keyof typeof CATEGORY_COLORS].text}`}
                                                    >
                                                        {challenge.category}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${DIFFICULTY_COLORS[challenge.difficulty as keyof typeof DIFFICULTY_COLORS].bg
                                                            } ${DIFFICULTY_COLORS[challenge.difficulty as keyof typeof DIFFICULTY_COLORS].text}`}
                                                    >
                                                        {challenge.difficulty}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {challenge.estimatedMinutes} min
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    <button
                                                        onClick={() => handleEdit(challenge)}
                                                        className="text-indigo-600 hover:text-indigo-900 mr-4"
                                                    >
                                                        Edit
                                                    </button>
                                                    <button
                                                        onClick={() => handleDeleteChallenge(challenge.id)}
                                                        className="text-red-600 hover:text-red-900"
                                                    >
                                                        Delete
                                                    </button>
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}

                {/* Users Tab */}
                {activeTab === 'users' && (
                    <div>
                        {isLoadingUsers ? (
                            <div className="flex justify-center py-12">
                                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
                            </div>
                        ) : (
                            <div className="bg-white rounded-lg shadow-sm overflow-hidden">
                                <table className="min-w-full divide-y divide-gray-200">
                                    <thead className="bg-gray-50">
                                        <tr>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Username
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Email
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Role
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Total Attempts
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Best Score
                                            </th>
                                            <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Joined
                                            </th>
                                            <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                                                Actions
                                            </th>
                                        </tr>
                                    </thead>
                                    <tbody className="bg-white divide-y divide-gray-200">
                                        {users.map((u) => (
                                            <tr key={u.id} className="hover:bg-gray-50">
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm font-medium text-gray-900">
                                                        {u.username}
                                                    </div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <div className="text-sm text-gray-500">{u.email}</div>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap">
                                                    <span
                                                        className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${u.role === 'admin'
                                                            ? 'bg-purple-100 text-purple-800'
                                                            : 'bg-gray-100 text-gray-800'
                                                            }`}
                                                    >
                                                        {u.role}
                                                    </span>
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {u.totalAttempts}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {u.bestScore.toFixed(1)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                                                    {formatDate(u.createdAt)}
                                                </td>
                                                <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                                    {u.role !== 'admin' ? (
                                                        <button
                                                            onClick={() => handleDeleteUser(u.id, u.username)}
                                                            className="text-red-600 hover:text-red-900"
                                                        >
                                                            Delete
                                                        </button>
                                                    ) : (
                                                        <span className="text-gray-400">Protected</span>
                                                    )}
                                                </td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Challenge Modal */}
            {showChallengeModal && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
                        <div className="p-6">
                            <h3 className="text-2xl font-bold text-gray-900 mb-6">
                                {editingChallenge ? 'Edit Challenge' : 'Add New Challenge'}
                            </h3>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Title
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.title}
                                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                </div>

                                <div className="grid grid-cols-2 gap-4">
                                    <div>
                                        <label className="block text-sm font-medium text-gray-700 mb-2">
                                            Category
                                        </label>
                                        <select
                                            value={formData.category}
                                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        >
                                            <option value="">Select Category</option>
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
                                            value={formData.difficulty}
                                            onChange={(e) => setFormData({ ...formData, difficulty: e.target.value })}
                                            className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                            required
                                        >
                                            <option value="">Select Difficulty</option>
                                            {DIFFICULTIES.map((diff) => (
                                                <option key={diff} value={diff}>
                                                    {diff}
                                                </option>
                                            ))}
                                        </select>
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Instruction
                                    </label>
                                    <textarea
                                        value={formData.instruction}
                                        onChange={(e) => setFormData({ ...formData, instruction: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tips (one per line)
                                    </label>
                                    <textarea
                                        value={formData.tips}
                                        onChange={(e) => setFormData({ ...formData, tips: e.target.value })}
                                        rows={4}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="Enter each tip on a new line"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Example Prompt
                                    </label>
                                    <textarea
                                        value={formData.examplePrompt}
                                        onChange={(e) => setFormData({ ...formData, examplePrompt: e.target.value })}
                                        rows={3}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Tags (comma-separated)
                                    </label>
                                    <input
                                        type="text"
                                        value={formData.tags}
                                        onChange={(e) => setFormData({ ...formData, tags: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        placeholder="react, typescript, api"
                                        required
                                    />
                                </div>

                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-2">
                                        Estimated Minutes
                                    </label>
                                    <input
                                        type="number"
                                        value={formData.estimatedMinutes}
                                        onChange={(e) => setFormData({ ...formData, estimatedMinutes: parseInt(e.target.value) })}
                                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
                                        min="1"
                                        required
                                    />
                                </div>

                                <div className="flex gap-4 pt-4">
                                    <button
                                        type="submit"
                                        className="flex-1 px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                    >
                                        {editingChallenge ? 'Update Challenge' : 'Create Challenge'}
                                    </button>
                                    <button
                                        type="button"
                                        onClick={() => setShowChallengeModal(false)}
                                        className="flex-1 px-4 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 transition-colors"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </form>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
