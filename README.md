# PromptCraft Frontend

React 18 + TypeScript frontend for the PromptCraft AI prompt evaluation platform.

## Tech Stack

- React 18 + TypeScript
- Vite (build tool)
- Tailwind CSS (styling)
- Zustand (state management)
- React Router v6 (routing)
- Axios (HTTP client)
- React Hot Toast (notifications)

## Setup

1. Install dependencies:
```bash
npm install
```

2. Create environment file:
```bash
cp .env.example .env
```

3. Update `.env` with your backend API URL:
```
VITE_API_BASE_URL=http://localhost:5000/api/v1
```

4. Start development server:
```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run type-check` - Run TypeScript type checking
- `npm run test` - Run tests

## Project Structure

```
src/
├── main.tsx                    # Entry point
├── App.tsx                     # Root component
├── routes/AppRoutes.tsx        # Route definitions
├── pages/                      # Page components
│   ├── HomePage.tsx
│   ├── LoginPage.tsx
│   ├── RegisterPage.tsx
│   ├── ChallengePage.tsx
│   ├── ResultPage.tsx
│   ├── HistoryPage.tsx
│   ├── LeaderboardPage.tsx
│   └── NotFoundPage.tsx
├── context/                    # React contexts
│   ├── AuthContext.tsx
│   └── context.ts
├── hooks/                      # Custom hooks
│   ├── useAuth.ts
│   ├── useEvaluation.ts
│   └── useLeaderboard.ts
├── store/                      # Zustand store
│   ├── store.ts
│   ├── hooks.ts
│   └── slices/
│       ├── challengeSlice.ts
│       └── evaluationSlice.ts
├── services/                   # API services
│   ├── auth/authService.ts
│   ├── challenge/challengeService.ts
│   ├── evaluation/evaluationService.ts
│   ├── leaderboard/leaderboardService.ts
│   ├── configs/
│   │   ├── app.config.ts
│   │   ├── BaseService.ts
│   │   └── ApiService.ts
│   └── index.ts
└── utils/
    ├── constants.ts
    └── commonFunctions/
        └── masterCommonFunctions.ts
```

## Key Features

- JWT authentication with automatic token refresh
- Protected routes with auth guards
- Challenge browsing with filters
- Real-time prompt evaluation
- Attempt history tracking
- Global leaderboard
- Responsive design with Tailwind CSS

## Architecture Patterns

- Pages never call Axios directly - always use services layer
- Barrel exports for clean imports
- BaseService handles auth headers and token refresh
- Zustand slices for domain-specific state
- Custom hooks for business logic

## Environment Variables

- `VITE_API_BASE_URL` - Backend API base URL (required)

## Notes

- Ensure backend is running before starting frontend
- Default backend URL is `http://localhost:5000/api/v1`
- All API calls go through the services layer
- Token refresh is handled automatically by BaseService
