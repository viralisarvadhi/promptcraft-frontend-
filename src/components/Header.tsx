import { useState, useEffect, useRef } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuthContext } from '@/context/context';
import { useAuth } from '@/hooks/useAuth';
import { ROUTES } from '@/utils/constants';

interface HeaderProps {
    showBackButton?: boolean;
    backTo?: string;
}

export default function Header({ showBackButton = false, backTo = ROUTES.HOME }: HeaderProps) {
    const navigate = useNavigate();
    const { isAuthenticated, user } = useAuthContext();
    const { logout } = useAuth();
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const dropdownRef = useRef<HTMLDivElement>(null);

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    const handleLogout = async () => {
        setIsDropdownOpen(false);
        await logout();
    };

    return (
        <header className="bg-white shadow-sm">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
                <div className="flex justify-between items-center">
                    <div className="flex items-center gap-4">
                        {showBackButton && (
                            <Link
                                to={backTo}
                                className="text-gray-600 hover:text-indigo-600 transition-colors"
                            >
                                ← Back
                            </Link>
                        )}
                        <Link to={ROUTES.HOME}>
                            <h1 className="text-2xl font-bold text-indigo-600">PromptCraft</h1>
                        </Link>
                    </div>
                    <nav className="flex items-center gap-4">
                        <Link
                            to={ROUTES.LEADERBOARD}
                            className="text-gray-700 hover:text-indigo-600 transition-colors"
                        >
                            Leaderboard
                        </Link>
                        {isAuthenticated ? (
                            <>
                                {user?.role === 'admin' && (
                                    <Link
                                        to={ROUTES.ADMIN}
                                        className="text-gray-700 hover:text-indigo-600 transition-colors font-semibold"
                                    >
                                        Admin Dashboard
                                    </Link>
                                )}
                                {user?.role !== 'admin' && (
                                    <Link
                                        to={ROUTES.HISTORY}
                                        className="text-gray-700 hover:text-indigo-600 transition-colors"
                                    >
                                        My History
                                    </Link>
                                )}
                                <div className="relative" ref={dropdownRef}>
                                    <button
                                        onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                        className="flex items-center gap-2 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                                    >
                                        <span className="text-sm text-gray-600">
                                            {user?.username}
                                        </span>
                                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-sm font-medium">
                                            {user?.bestScore.toFixed(1)}
                                        </span>
                                        <svg
                                            className={`w-4 h-4 text-gray-600 transition-transform ${isDropdownOpen ? 'rotate-180' : ''
                                                }`}
                                            fill="none"
                                            stroke="currentColor"
                                            viewBox="0 0 24 24"
                                        >
                                            <path
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                strokeWidth={2}
                                                d="M19 9l-7 7-7-7"
                                            />
                                        </svg>
                                    </button>

                                    {isDropdownOpen && (
                                        <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                                            <button
                                                onClick={() => {
                                                    setIsDropdownOpen(false);
                                                    navigate(ROUTES.PROFILE);
                                                }}
                                                className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 transition-colors flex items-center gap-2"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                                                    />
                                                </svg>
                                                Profile
                                            </button>
                                            <button
                                                onClick={handleLogout}
                                                className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 transition-colors flex items-center gap-2"
                                            >
                                                <svg
                                                    className="w-4 h-4"
                                                    fill="none"
                                                    stroke="currentColor"
                                                    viewBox="0 0 24 24"
                                                >
                                                    <path
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                        strokeWidth={2}
                                                        d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"
                                                    />
                                                </svg>
                                                Logout
                                            </button>
                                        </div>
                                    )}
                                </div>
                            </>
                        ) : (
                            <>
                                <Link
                                    to={ROUTES.LOGIN}
                                    className="text-gray-700 hover:text-indigo-600 transition-colors"
                                >
                                    Sign in
                                </Link>
                                <Link
                                    to={ROUTES.REGISTER}
                                    className="px-4 py-2 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors"
                                >
                                    Sign up
                                </Link>
                            </>
                        )}
                    </nav>
                </div>
            </div>
        </header>
    );
}
