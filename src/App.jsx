import React from 'react';
import { Route, BrowserRouter as Router, Routes, Navigate, useLocation } from 'react-router-dom';

// LOGIN
import Login from './Pages/Login';

// FACULTY MODULE
import FacultyNavbar from './Pages/Faculty/FacultyNavbar';
import FacultyHome from './Pages/Faculty/FacultyHome';
import StudentTracker from './Pages/Faculty/StudentTracker';
import FacultyInsights from './Pages/Faculty/FacultyInsights';
import AcademicHub from './Pages/Faculty/AcademicHub';
import FacultyProfile from './Pages/Faculty/FacultyProfile';
import Research from './Pages/Faculty/Research';

import ManagerHome from './Pages/Manager/ManagerHome';

import StudentHome from './Pages/Student/StudentHome';
import StudentNavbar from './Pages/Student/StudentNavbar';
import StudentExplore from './Pages/Student/StudentExplore';
import MyApplications from './Pages/Student/MyApplications';
import MyInternship from './Pages/Student/MyInternship';
import ResearchLOR from './Pages/Student/ResearchLOR';
import ProfileSkillHub from './Pages/Student/ProfileSkillHub';

import AdminHome from './Pages/Admin/AdminHome';

import './App.css'


const AppContent = () => {
  const location = useLocation();
  const path = location.pathname;

  // Boolean flags for UI rendering
  const isLoginPage = path === '/login' || path === '/';
  const isFaculty = path.includes('-faculty');
  const isStudent = path.includes('-student');
  const isManager = path.includes('-manager');
  const isAdmin = path.includes('-admin');

  return (
    <div className="flex min-h-screen bg-[#f8fafc]">
      {/* Sidebars render only for their specific roles */}
      {isFaculty && <FacultyNavbar />}
      {isStudent && <StudentNavbar />}

      <div className="flex-1 flex flex-col">
        {/* Universal Top Header (Hidden on Login) */}
        {!isLoginPage && (
          <header className="h-16 border-b border-gray-200 bg-white flex items-center px-8 sticky top-0 z-10">
            <div className="flex justify-between items-center w-full">
              <h2 className="text-xl font-bold text-gray-800">
                {isFaculty ? "Faculty Hub" : isStudent ? "Student Portal" : "Management System"}
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
            <Route path='/home-faculty' element={<FacultyHome />} />
            <Route path='/tracker-faculty' element={<StudentTracker />} />
            <Route path='/academic-faculty' element={<AcademicHub />} />
            <Route path='/research-faculty' element={<Research />} />
            <Route path='/insights-faculty' element={<FacultyInsights />} />
            <Route path='/profile-faculty' element={<FacultyProfile />} />
            

            {/* Student */}
            <Route path='/home-student' element={<StudentHome/>} />
            <Route path='/explore-student' element={<StudentExplore />} />
            <Route path='/apps-student' element={<MyApplications />} />
            <Route path='/internship-student' element={<MyInternship />} />
            <Route path='/research-student' element={<ResearchLOR />} />
            <Route path='/profile-student' element={<ProfileSkillHub />} />
            
            {/* Manager */}
            <Route path='/home-manager' element={<ManagerHome/>} />

            {/* Admin */}
            <Route path='/home-admin' element={<AdminHome/>} />
          </Routes>
        </main>
      </div>
    </div>
  );
};

// Main App Component
const App = () => {
  return (
    <Router>
      <AppContent />
    </Router>
  );
}

export default App;