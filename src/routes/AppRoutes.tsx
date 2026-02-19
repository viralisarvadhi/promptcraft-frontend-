import { Routes, Route, Navigate } from 'react-router-dom';
import { useAuthContext } from '@/context/context';
import { ROUTES } from '@/utils/constants';

// Lazy load pages
import { lazy, Suspense } from 'react';

const HomePage = lazy(() => import('@/pages/HomePage'));
const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const ChallengePage = lazy(() => import('@/pages/ChallengePage'));
const ResultPage = lazy(() => import('@/pages/ResultPage'));
const HistoryPage = lazy(() => import('@/pages/HistoryPage'));
const ProfilePage = lazy(() => import('@/pages/ProfilePage'));
const AdminDashboardPage = lazy(() => import('@/pages/AdminDashboardPage'));
const LeaderboardPage = lazy(() => import('@/pages/LeaderboardPage'));
const NotFoundPage = lazy(() => import('@/pages/NotFoundPage'));

// Loading component
function PageLoader() {
    return (
        <div className="flex items-center justify-center min-h-screen">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
        </div>
    );
}

// Protected route wrapper
interface ProtectedRouteProps {
    children: React.ReactNode;
}

function ProtectedRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuthContext();

    if (isLoading) {
        return <PageLoader />;
    }

    if (!isAuthenticated) {
        return <Navigate to={ROUTES.LOGIN} replace />;
    }

    return <>{children}</>;
}

// Public only route (redirect to home if authenticated)
function PublicOnlyRoute({ children }: ProtectedRouteProps) {
    const { isAuthenticated, isLoading } = useAuthContext();

    if (isLoading) {
        return <PageLoader />;
    }

    if (isAuthenticated) {
        return <Navigate to={ROUTES.HOME} replace />;
    }

    return <>{children}</>;
}

export default function AppRoutes() {
    return (
        <Suspense fallback={<PageLoader />}>
            <Routes>
                {/* Public routes */}
                <Route path={ROUTES.HOME} element={<HomePage />} />
                <Route path={ROUTES.LEADERBOARD} element={<LeaderboardPage />} />

                {/* Auth routes (public only) */}
                <Route
                    path={ROUTES.LOGIN}
                    element={
                        <PublicOnlyRoute>
                            <LoginPage />
                        </PublicOnlyRoute>
                    }
                />
                <Route
                    path={ROUTES.REGISTER}
                    element={
                        <PublicOnlyRoute>
                            <RegisterPage />
                        </PublicOnlyRoute>
                    }
                />

                {/* Protected routes */}
                <Route
                    path={ROUTES.CHALLENGE}
                    element={
                        <ProtectedRoute>
                            <ChallengePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.RESULT}
                    element={
                        <ProtectedRoute>
                            <ResultPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.HISTORY}
                    element={
                        <ProtectedRoute>
                            <HistoryPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.PROFILE}
                    element={
                        <ProtectedRoute>
                            <ProfilePage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path={ROUTES.ADMIN}
                    element={
                        <ProtectedRoute>
                            <AdminDashboardPage />
                        </ProtectedRoute>
                    }
                />

                {/* 404 */}
                <Route path="*" element={<NotFoundPage />} />
            </Routes>
        </Suspense>
    );
}
