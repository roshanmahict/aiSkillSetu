import React from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { LanguageProvider } from './context/LanguageContext';
import { AuthProvider } from './context/AuthContext';
import Navbar from './components/common/Navbar';
import Footer from './components/common/Footer';
import HomePage from './pages/HomePage';
import LocationsPage from './pages/LocationsPage';
import DynamicPage from './pages/DynamicPage';
import ContactPage from './pages/ContactPage';


// Auth & User pages
import Login from './pages/Login';
import Signup from './pages/Signup';
import SignupWorker from './pages/SignupWorker';
import SignupContractor from './pages/SignupContractor';
import ProfilePage from './pages/ProfilePage';
import ForgotPassword from './pages/ForgotPassword';
import ResetPassword from './pages/ResetPassword';
import MenuEditor from './components/admin/MenuEditor';

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <BrowserRouter>
          <Navbar />
          <Routes>
            {/* ✅ 1. HOME – MUST BE FIRST */}

            {/* ✅ 2. AUTH ROUTES */}
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/signup/worker" element={<SignupWorker />} />
            <Route path="/signup/contractor" element={<SignupContractor />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/forgot-password" element={<ForgotPassword />} />
            <Route path="/reset-password/:uid/:token" element={<ResetPassword />} />

            {/* ✅ 3. ADMIN */}
            <Route path="/admin/menu" element={<MenuEditor />} />

            {/* ✅ 4. AREAS WE SERVE (SPECIAL LAYOUT) */}
            <Route path="/area-we-serve/:slug" element={<LocationsPage />} />

            {/* ✅ 5. DYNAMIC CATCH-ALL – MUST BE LAST */}
            {/* Handles: /about, /services, /contact, /faq, /privacy, /terms, etc. */}
              <Route path="/contact" element={<ContactPage />} />

            <Route path="/:slug" element={<DynamicPage />} />
            <Route path="/" element={<HomePage />} />
<Route path="/home" element={<Navigate to="/" replace />} />  

            {/* ✅ 6. 404 FALLBACK */}
            <Route path="*" element={<NotFound />} />
          </Routes>
          <Footer />
        </BrowserRouter>
      </AuthProvider>
    </LanguageProvider>
  );
}

// Simple 404 component
const NotFound = () => (
  <div style={{ textAlign: 'center', padding: '4rem' }}>
    <h1>404 – Page Not Found</h1>
    <p>The page you are looking for does not exist.</p>
  </div>
);

export default App;