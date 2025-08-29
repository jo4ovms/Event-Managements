import React from 'react';
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from 'react-router-dom';
import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';
import Navbar from './components/Layout/Navbar';
import LoginForm from './components/Auth/LoginForm';
import RegisterForm from './components/Auth/RegisterForm';
import Dashboard from './components/Dashboard/Dashboard';
import EventList from './components/Events/EventList';
import MyRegistrations from './components/Registration/MyRegistrations';

function App() {
  return (
    <Router>
      <AuthProvider>
        <div className='App'>
          <Navbar />

          <Routes>
            <Route path='/login' element={<LoginForm />} />
            <Route path='/register' element={<RegisterForm />} />

            <Route
              path='/dashboard'
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              }
            />

            <Route
              path='/events'
              element={
                <ProtectedRoute>
                  <EventList />
                </ProtectedRoute>
              }
            />

            <Route
              path='/my-registrations'
              element={
                <ProtectedRoute>
                  <MyRegistrations />
                </ProtectedRoute>
              }
            />

            <Route path='/' element={<Navigate to='/dashboard' replace />} />

            <Route path='*' element={<Navigate to='/dashboard' replace />} />
          </Routes>
        </div>
      </AuthProvider>
    </Router>
  );
}

export default App;
