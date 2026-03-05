import React from 'react';
import { Route, BrowserRouter as Router, Routes, Navigate, useLocation } from 'react-router-dom';

// LOGIN
import Login from './Pages/Login';

import FacultyNavbar from './Pages/Faculty/FacultyNavbar';
import FacultyHome from './Pages/Faculty/FacultyHome';
import StudentTracker from './Pages/Faculty/StudentTracker';
import FacultyInsights from './Pages/Faculty/FacultyInsights';
import AcademicHub from './Pages/Faculty/AcademicHub';
import FacultyProfile from './Pages/Faculty/FacultyProfile';
import Research from './Pages/Faculty/Research';

import StudentNavbar from './Pages/Student/StudentNavbar';
import StudentExplore from './Pages/Student/StudentExplore';
import MyInternship from './Pages/Student/MyInternship';
import StudentProfile from './Pages/Student/StudentProfile';


import AdminNavbar from './Pages/Admin/AdminNavbar';
import AdminDashboard from './Pages/Admin/AdminDashboard';
import UserManagement from './Pages/Admin/UserManagement';
import ResearchApprovals from './Pages/Admin/ResearchApprovals';


import './App.css'
import Bonafide from './Pages/Student/Bonafide';


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
            <Route path='/home-faculty' element={<FacultyHome />} />
            <Route path='/tracker-faculty' element={<StudentTracker />} />
            <Route path='/academic-faculty' element={<AcademicHub />} />
            <Route path='/research-faculty' element={<Research />} />
            <Route path='/insights-faculty' element={<FacultyInsights />} />
            <Route path='/profile-faculty' element={<FacultyProfile />} />
            

            {/* Student */}
            <Route path='/explore-student' element={<StudentExplore />} />
            <Route path='/internship-student' element={<MyInternship />} />
            <Route path='/bonafide-student' element={<Bonafide />} />
            <Route path='/profile-student' element={<StudentProfile />} />

            {/* Admin */}
            <Route path='/home-admin' element={<AdminDashboard/>} />
            <Route path='/users-admin' element={<UserManagement/>} />
            <Route path='/approvals-admin' element={<ResearchApprovals/>} />
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