import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter, Routes, Route } from 'react-router-dom'
import { Toaster } from 'react-hot-toast'
import HomePage from './pages/HomePage'
import BuilderPage from './pages/BuilderPage'
import DashboardPage from './pages/DashboardPage'
import { AuthProvider } from './contexts/AuthContext'
import ProtectedRoute from './components/ProtectedRoute'
import './index.css'

// Optional: load Microsoft Clarity only if env var is present
const clarityId = import.meta.env.VITE_CLARITY_ID as string | undefined;
if (clarityId && typeof window !== 'undefined') {
  (function (c: any, l: Document, a: string, r: string, i: string, t?: HTMLScriptElement, y?: Node) {
    c[a] = c[a] || function () { (c[a].q = c[a].q || []).push(arguments) };
    t = l.createElement(r) as HTMLScriptElement; t.async = true; t.src = `https://www.clarity.ms/tag/${i}`;
    y = l.getElementsByTagName(r)[0]; y?.parentNode?.insertBefore(t, y);
  })(window as any, document, 'clarity', 'script', clarityId);
}

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <BrowserRouter>
        <Toaster 
          position="top-center"
          toastOptions={{
            duration: 3000,
            style: {
              background: '#363636',
              color: '#fff',
            },
            success: {
              duration: 3000,
              iconTheme: {
                primary: '#10b981',
                secondary: '#fff',
              },
            },
            error: {
              duration: 4000,
              iconTheme: {
                primary: '#ef4444',
                secondary: '#fff',
              },
            },
          }}
        />
        <Routes>
          <Route path="/" element={<HomePage />} />
          <Route 
            path="/builder" 
            element={
              <ProtectedRoute>
                <BuilderPage />
              </ProtectedRoute>
            } 
          />
          <Route 
            path="/dashboard" 
            element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } 
          />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </React.StrictMode>,
)
