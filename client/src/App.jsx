import React from 'react';
import { Route, BrowserRouter as Router, Routes, Navigate, useLocation } from 'react-router-dom';

// LOGIN
import Login from './Pages/Login';

import FacultyNavbar from './Pages/Faculty/FacultyNavbar';
import FacultyHome from './Pages/Faculty/FacultyHome';
import OdRequests from './Pages/Faculty/OdRequests';
import FacultyInsights from './Pages/Faculty/FacultyInsights';
import BonafideRequests from './Pages/Faculty/BonafideRequests';
import FacultyProfile from './Pages/Faculty/FacultyProfile';
import DocumentVerification from './Pages/Faculty/DocumentVerification';

import StudentNavbar from './Pages/Student/StudentNavbar';
import StudentExplore from './Pages/Student/StudentExplore';
import MyInternship from './Pages/Student/MyInternship';
import StudentProfile from './Pages/Student/StudentProfile';


import AdminNavbar from './Pages/Admin/AdminNavbar';
import AdminAnalytics from './Pages/Admin/AdminAnalytics';
import UserManagement from './Pages/Admin/UserManagement';


import './App.css'
import Bonafide from './Pages/Student/Bonafide';

const ProtectedRoute = ({ children }) => {
  const token = localStorage.getItem('access_token');
  if (!token) return <Navigate to="/login" replace />;
  return children;
};

const AppContent = () => {
  const location = useLocation();
  const path = location.pathname;

  const isLoginPage = path === '/login' || path === '/';
  const isFaculty = path.includes('-faculty');
  const isStudent = path.includes('-student');
  const isAdmin = path.includes('-admin');

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {isFaculty && <FacultyNavbar />}
      {isStudent && <StudentNavbar />}
      {isAdmin && <AdminNavbar/>}


      <div className="flex-1 flex flex-col">
        {!isLoginPage && (
          <header className="h-16 border-b border-gray-200 bg-white flex items-center px-8 sticky top-0 z-10">
            <div className="flex justify-between items-center w-full">
              <h2 className="text-xl font-bold text-gray-800">
                {isFaculty ? "Internhsip In-Charge" : isStudent ? "Student Portal" : "Management System"}
              </h2>
            </div>
          </header>
        )}

        
        <main className={isLoginPage ? "" : "flex-1 min-w-0 overflow-y-auto"}>
          <Routes>
            {/* Redirect root to login */}
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />

            {/* Faculty (Flat Routes) */}
            <Route path='/home-faculty' element={<ProtectedRoute><FacultyHome /></ProtectedRoute>} />
            <Route path='/od-faculty' element={<ProtectedRoute><OdRequests /></ProtectedRoute>} />
            <Route path='/bonafide-faculty' element={<ProtectedRoute><BonafideRequests /></ProtectedRoute>} />
            <Route path='/document-faculty' element={<ProtectedRoute><DocumentVerification /></ProtectedRoute>} />
            <Route path='/insights-faculty' element={<ProtectedRoute><FacultyInsights /></ProtectedRoute>} />
            <Route path='/profile-faculty' element={<ProtectedRoute><FacultyProfile /></ProtectedRoute>} />
            

            {/* Student */}
            <Route path='/explore-student' element={<ProtectedRoute><StudentExplore /></ProtectedRoute>} />
            <Route path='/internship-student' element={<ProtectedRoute><MyInternship /></ProtectedRoute>} />
            <Route path='/bonafide-student' element={<ProtectedRoute><Bonafide /></ProtectedRoute>} />
            <Route path='/profile-student' element={<ProtectedRoute><StudentProfile /></ProtectedRoute>} />

            {/* Admin */}
            <Route path='/insights-admin' element={<AdminAnalytics/>} />
            <Route path='/users-admin' element={<UserManagement/>} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;