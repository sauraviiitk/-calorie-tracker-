import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { Toaster } from 'react-hot-toast';
import AppLayout from './components/layout/AppLayout';
import LandingPage from './pages/LandingPage';
import DashboardPage from './pages/DashboardPage';
import AuthPage from './pages/AuthPage';
import FoodDiaryPage from './pages/FoodDiaryPage';
import GoalsPage from './pages/GoalsPage';
import ReportsPage from './pages/ReportsPage';
import AIScannerPage from './pages/AIScannerPage';
import ProfilePage from './pages/ProfilePage';
import ChatBotFAB from './components/ai/ChatBotFAB';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute, { GuestRoute } from './components/layout/ProtectedRoute';

function App() {
  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          {/* Public landing - redirect to dashboard if already logged in */}
          <Route path="/" element={<GuestRoute><LandingPage /></GuestRoute>} />

          {/* Auth routes - redirect to dashboard if already logged in */}
          <Route path="/login" element={<GuestRoute><AuthPage /></GuestRoute>} />
          <Route path="/signup" element={<GuestRoute><AuthPage /></GuestRoute>} />
          <Route path="/auth" element={<Navigate to="/login" replace />} />

          {/* Protected Routes - Wrapped in AppLayout */}
          <Route path="/dashboard" element={<ProtectedRoute><AppLayout><DashboardPage /></AppLayout></ProtectedRoute>} />
          <Route path="/diary" element={<ProtectedRoute><AppLayout><FoodDiaryPage /></AppLayout></ProtectedRoute>} />
          <Route path="/goals" element={<ProtectedRoute><AppLayout><GoalsPage /></AppLayout></ProtectedRoute>} />
          <Route path="/reports" element={<ProtectedRoute><AppLayout><ReportsPage /></AppLayout></ProtectedRoute>} />
          <Route path="/scanner" element={<ProtectedRoute><AppLayout><AIScannerPage /></AppLayout></ProtectedRoute>} />
          <Route path="/profile" element={<ProtectedRoute><AppLayout><ProfilePage /></AppLayout></ProtectedRoute>} />

          {/* Catch all */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        {/* Global AI Chatbot */}
        <ChatBotFAB />
        <Toaster position="top-center" toastOptions={{ duration: 4000, style: { background: '#1c1b1f', color: '#e6e1e5', borderRadius: '12px' } }} />
      </BrowserRouter>
    </AuthProvider>
  );
}

export default App;
