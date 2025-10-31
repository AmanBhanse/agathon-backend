# Project Structure & Routing Documentation

## 📁 New Project Structure

```
src/
├── components/
│   ├── Header.jsx         # Application header with avatar & logout
│   ├── Sidebar.jsx        # Navigation sidebar
│   ├── Layout.jsx         # Main layout wrapper
│   └── ProtectedRoute.jsx # Protected route wrapper
│
├── pages/
│   ├── LoginPage.jsx      # Login page
│   ├── HomePage.jsx       # Home page
│   ├── SummaryPage.jsx    # Summary page
│   └── SuggestionsPage.jsx # Suggestions page
│
├── App.jsx                # Main app with routing
├── store.js               # Zustand store for state management
├── main.jsx               # Entry point
└── index.css              # Global styles
```

## 🛣️ Route Configuration

### Public Routes

- `/login` - Login page (accessible without authentication)
- `/` - Redirects to `/login`

### Protected Routes (Requires Authentication)

- `/app/home` - Home page
- `/app/summary` - Summary page
- `/app/suggestions` - Suggestions page
- `/app` - Redirects to `/app/home`

### Catch-all

- `*` - Redirects to `/login`

## 🔐 Authentication Flow

1. **Login Route** (`/login`)

   - User enters case number and name
   - Data stored in Zustand store
   - After successful login, navigates to `/app/home`

2. **Protected Routes** (`/app/*`)

   - `ProtectedRoute` component checks if user is authenticated
   - If not authenticated: redirects to `/login`
   - If authenticated: renders requested page with Layout

3. **Logout**
   - Avatar dropdown menu has logout button
   - Clears user data from store
   - Navigates back to `/login`

## 📦 Component Breakdown

### Header (`components/Header.jsx`)

- Displays app title and logo
- Shows user avatar (initials) when logged in
- Dropdown menu with logout option
- Uses `useNavigate` hook for logout redirect

### Sidebar (`components/Sidebar.jsx`)

- Collapsible navigation menu
- Three main navigation links:
  - 🏠 Home → `/app/home`
  - 📊 Summary → `/app/summary`
  - 💡 Suggestions → `/app/suggestions`
- Uses `useNavigate` hook for navigation

### Layout (`components/Layout.jsx`)

- Wraps Header and Sidebar
- Provides main content area
- Used as wrapper in protected routes

### ProtectedRoute (`components/ProtectedRoute.jsx`)

- Checks if user is authenticated (checks for `userName`)
- If not: redirects to `/login`
- If yes: renders Layout with children

## 📄 Pages

### LoginPage (`pages/LoginPage.jsx`)

- Two-step login process
- Step 1: Enter case number
- Step 2: Enter name
- Navigates to `/app/home` on success

### HomePage (`pages/HomePage.jsx`)

- Welcome page showing case number
- Displays when user logs in

### SummaryPage (`pages/SummaryPage.jsx`)

- Shows case summary with:
  - Case number
  - Assigned user
  - Status
  - Task statistics

### SuggestionsPage (`pages/SuggestionsPage.jsx`)

- Lists suggestions with priority levels
- Accept/Review Later buttons

## 🔧 Store (Zustand)

```javascript
useCaseStore:
- caseNumber: string    # Logged-in user's case number
- userName: string      # Logged-in user's name
- setCaseNumber()       # Set case number
- setUserName()         # Set user name
- logout()              # Clear all user data
```

## 🚀 Usage Examples

### Navigating to a page

```javascript
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();
navigate("/app/summary"); // Go to summary page
navigate("/login"); // Go to login
```

### Accessing store data

```javascript
import { useCaseStore } from "./store";

const caseNumber = useCaseStore((state) => state.caseNumber);
const userName = useCaseStore((state) => state.userName);
```

### Checking authentication

```javascript
import { useCaseStore } from "./store";

const userName = useCaseStore((state) => state.userName);
const isLoggedIn = !!userName; // Boolean check
```

## ✨ Key Features

✅ Client-side routing with React Router
✅ Protected routes with authentication check
✅ Collapsible sidebar navigation
✅ User avatar with logout dropdown
✅ Zustand state management
✅ Clean folder structure
✅ Responsive design
✅ Smooth animations

## 📝 Environment Setup

Make sure `react-router-dom` is installed:

```bash
npm install react-router-dom
```

Start the development server:

```bash
npm run dev
```
