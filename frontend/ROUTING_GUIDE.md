# Frontend Application - Routing & Structure Guide

## 🎯 Quick Start

The application has been refactored with **React Router** for proper client-side navigation.

### Install Dependencies

```bash
npm install react-router-dom
```

### Run Development Server

```bash
npm run dev
```

### Build for Production

```bash
npm run build
```

---

## 🗂️ File Organization

### Before (Old Structure)

```
src/
├── App.jsx
├── Header.jsx
├── Sidebar.jsx
├── Layout.jsx
├── Login.jsx
├── Home.jsx
├── Summary.jsx
├── Suggestions.jsx
├── store.js
└── main.jsx
```

### After (New Structure)

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx
│   ├── Sidebar.jsx
│   ├── Layout.jsx
│   └── ProtectedRoute.jsx
│
├── pages/              # Page components (one per route)
│   ├── LoginPage.jsx
│   ├── HomePage.jsx
│   ├── SummaryPage.jsx
│   └── SuggestionsPage.jsx
│
├── App.jsx             # Main routing configuration
├── store.js            # Zustand store
├── main.jsx            # Entry point
└── index.css           # Global styles
```

---

## 🛣️ Routes

| Route              | Component       | Auth Required | Description           |
| ------------------ | --------------- | ------------- | --------------------- |
| `/login`           | LoginPage       | ❌ No         | Login page            |
| `/app/home`        | HomePage        | ✅ Yes        | Home/dashboard        |
| `/app/summary`     | SummaryPage     | ✅ Yes        | Case summary          |
| `/app/suggestions` | SuggestionsPage | ✅ Yes        | Suggestions           |
| `/`                | N/A             | N/A           | Redirects to `/login` |
| `*`                | N/A             | N/A           | Redirects to `/login` |

---

## 🔐 Authentication

### How It Works

1. **Unprotected**: User can access `/login` without authentication
2. **Login**: User enters case number and name
3. **Store**: Credentials stored in Zustand store
4. **Protected**: Access `/app/*` routes
5. **Check**: ProtectedRoute component verifies `userName` exists
6. **Redirect**: If not authenticated, redirect to `/login`

### Checking Authentication

```javascript
import { useCaseStore } from "../store";

const userName = useCaseStore((state) => state.userName);
if (!userName) {
  // Not logged in
}
```

---

## 📱 Navigation

### Sidebar Links

```
🏠 Home    → /app/home
📊 Summary → /app/summary
💡 Suggestions → /app/suggestions
```

### Programmatic Navigation

```javascript
import { useNavigate } from "react-router-dom";

const navigate = useNavigate();

// Navigate to home
navigate("/app/home");

// Navigate to login
navigate("/login");

// Go back
navigate(-1);
```

---

## 💾 State Management (Zustand)

### Store

```javascript
useCaseStore
  ├── caseNumber: string
  ├── userName: string
  ├── setCaseNumber(num)
  ├── setUserName(name)
  └── logout()
```

### Usage

```javascript
import { useCaseStore } from "../store";

export default function MyComponent() {
  const caseNumber = useCaseStore((state) => state.caseNumber);
  const userName = useCaseStore((state) => state.userName);
  const setCaseNumber = useCaseStore((state) => state.setCaseNumber);

  return <div>{caseNumber}</div>;
}
```

---

## 🔗 Component Relationships

```
App.jsx (Router Setup)
│
├── /login
│   └── LoginPage
│
└── /app/*
    └── ProtectedRoute (Auth Check)
        ├── Header (with Logout)
        ├── Sidebar (Navigation)
        └── Main Content
            ├── HomePage
            ├── SummaryPage
            └── SuggestionsPage
```

---

## 🎨 Key Features

✅ **React Router v6** - Modern client-side routing
✅ **Protected Routes** - Authentication guard
✅ **Zustand** - Lightweight state management
✅ **Responsive Design** - Mobile-friendly layout
✅ **Collapsible Sidebar** - Space-saving navigation
✅ **User Avatar** - With logout dropdown
✅ **Clean Structure** - Organized file layout

---

## 📝 Adding New Pages

### Step 1: Create Page Component

```javascript
// src/pages/NewPage.jsx
import { useCaseStore } from "../store";

export default function NewPage() {
  return <div>New Page</div>;
}
```

### Step 2: Add Route

```javascript
// src/App.jsx
import NewPage from "./pages/NewPage";

// Inside <Routes>
<Route
  path="/app/new"
  element={
    <ProtectedRoute>
      <NewPage />
    </ProtectedRoute>
  }
/>;
```

### Step 3: Add Navigation Link

```javascript
// src/components/Sidebar.jsx
const navItems = [
  { id: "home", label: "Home", icon: "🏠", path: "/app/home" },
  { id: "new", label: "New", icon: "⭐", path: "/app/new" },
  // ... other items
];
```

---

## 🐛 Debugging Tips

### Check Authentication

```javascript
import { useCaseStore } from "../store";

const debug = () => {
  const store = useCaseStore.getState();
  console.log("Case Number:", store.caseNumber);
  console.log("User Name:", store.userName);
};
```

### Monitor Route Changes

Use React Router DevTools or check browser console:

```javascript
window.location.pathname;
```

### Clear Store (Dev Only)

```javascript
useCaseStore.setState({ caseNumber: "", userName: "" });
```

---

## 📚 Useful React Router Hooks

```javascript
import {
  useNavigate, // Navigate programmatically
  useLocation, // Get current location
  useParams, // Get route parameters
  useSearchParams, // Get query string parameters
} from "react-router-dom";
```

---

## ✨ Next Steps

1. Test the navigation - click through all pages
2. Try logging in and logging out
3. Verify protected routes work
4. Add more pages following the pattern
5. Customize styling as needed

---

For detailed documentation, see `STRUCTURE_DOCUMENTATION.md`
