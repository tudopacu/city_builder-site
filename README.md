# City Builder - Player Portal

Frontend site for login, registration, news, and game management.

## Overview

This is a React + TypeScript skeleton application built with a modular architecture. It provides player registration, login, and logout functionality with a clean, maintainable structure.

## Technology Stack

- **React 18** - UI library
- **TypeScript** - Type-safe JavaScript
- **Vite** - Fast build tool and dev server
- **React Router** - Client-side routing
- **ESLint** - Code quality and linting

## Project Structure

```
city_builder-site/
├── src/
│   ├── components/         # React components
│   │   ├── Home.tsx       # Home/dashboard page
│   │   ├── Login.tsx      # Login form component
│   │   └── Register.tsx   # Registration form component
│   ├── contexts/          # React contexts
│   │   ├── AuthContext.tsx # Authentication context provider
│   │   └── useAuth.ts     # Custom hook for auth context
│   ├── modules/           # Business logic modules
│   │   └── authApi.ts     # Authentication API service
│   ├── types/             # TypeScript type definitions
│   │   └── auth.ts        # Authentication-related types
│   ├── App.tsx            # Main application component
│   ├── App.css            # Application styles
│   ├── main.tsx           # Application entry point
│   ├── index.css          # Global styles
│   └── vite-env.d.ts      # Vite type definitions
├── index.html             # HTML entry point
├── package.json           # Dependencies and scripts
├── tsconfig.json          # TypeScript configuration
├── vite.config.ts         # Vite configuration
└── .eslintrc.cjs          # ESLint configuration
```

## Modular Architecture

The application follows a modular approach with clear separation of concerns:

### 1. **API Module** (`src/modules/authApi.ts`)
- Handles all API communication
- Provides `authApi` object with methods for:
  - `register()` - Player registration
  - `login()` - Player authentication
  - `logout()` - Player logout
- Centralizes API configuration and error handling

### 2. **Context Module** (`src/contexts/`)
- **AuthContext.tsx**: Provides authentication state management
- **useAuth.ts**: Custom hook for accessing auth context
- Manages global authentication state
- Provides auth functions to all components
- Persists session to localStorage

### 3. **Component Modules** (`src/components/`)
- **Home.tsx**: Landing page and authenticated dashboard
- **Login.tsx**: Login form with validation
- **Register.tsx**: Registration form with validation
- Each component is self-contained and reusable

### 4. **Type Definitions** (`src/types/`)
- Centralizes TypeScript interfaces and types
- Ensures type safety across the application
- Documents data structures

## Getting Started

### Prerequisites

- Node.js 18+ and npm

### Installation

1. Clone the repository:
```bash
git clone https://github.com/tudopacu/city_builder-site.git
cd city_builder-site
```

2. Install dependencies:
```bash
npm install
```

3. Configure the API endpoint:
```bash
cp .env.example .env
```

Edit `.env` and set your API URL:
```
VITE_API_BASE_URL=http://your-api-url/api
```

### Development

Start the development server:
```bash
npm run dev
```

The app will be available at `http://localhost:5173`

### Building for Production

Build the application:
```bash
npm run build
```

Preview the production build:
```bash
npm run preview
```

### Code Quality

Run the linter:
```bash
npm run lint
```

## Features

### ✅ Player Registration
- Username, email, and password validation
- Password confirmation
- Error handling and user feedback
- Automatic login after successful registration

### ✅ Player Login
- Username and password authentication
- Session persistence via localStorage
- Error handling and user feedback
- Redirect to dashboard after successful login

### ✅ Player Logout
- Secure logout with API call
- Session cleanup
- Redirect to login page

### ✅ Protected Routes
- Authentication state management
- Conditional rendering based on auth status
- Persistent sessions across page refreshes

## API Integration

The application expects the following API endpoints:

### POST `/api/auth/register`
Request:
```json
{
  "username": "string",
  "email": "string",
  "password": "string"
}
```

Response:
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string"
  }
}
```

### POST `/api/auth/login`
Request:
```json
{
  "username": "string",
  "password": "string"
}
```

Response:
```json
{
  "token": "string",
  "user": {
    "id": "string",
    "username": "string",
    "email": "string"
  }
}
```

### POST `/api/auth/logout`
Headers:
```
Authorization: Bearer <token>
```

Response:
```json
{
  "message": "Logged out successfully"
}
```

## Future Enhancements

- [ ] News feed integration
- [ ] City management dashboard
- [ ] Resource tracking
- [ ] Leaderboards
- [ ] Player profiles
- [ ] Social features
- [ ] Unit tests
- [ ] E2E tests

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Run linting: `npm run lint`
5. Test the build: `npm run build`
6. Submit a pull request

## License

This project is part of the City Builder game system.
