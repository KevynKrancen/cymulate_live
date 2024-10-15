import React, { useState, useContext } from 'react';
import { useMediaQuery, CssBaseline } from '@mui/material';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import { Routes, Route, Navigate, useLocation } from "react-router-dom";
import { AuthProvider } from './context/Auth/AuthProvider';
import { Auth } from './context/Auth/Auth';
import { ThemeModeInterface } from './context/ThemeMode/ThemeModeInterface';
import { ThemeMode } from './context/ThemeMode/ThemeMode';
import { LightTheme, DarkTheme } from './theme/theme';
import Homepage from './pages/Home/HomePage';
import ContactPage from './pages/Contact/CreateTaskPage';
import LoginPage from './pages/Login/LoginPage';
import RegisterPage from './pages/Register/RegisterPage';
import ProfilePage from './pages/Profile/ProfilePage';
import SpacePage from './pages/Space/SpacePage';
import Header from './components/Header/Header';
import Footer from './components/Footer/Footer';
import { TokenStorage } from './services';
import './App.css';
import TasksPage from './pages/Tasks/TasksPage';
import CreateTaskPage from './pages/Contact/CreateTaskPage';
import TaskDataPage from './pages/TaskData/TaskDataPage';

const ProtectedRoute = ({ children }: { children: React.ReactNode }) => {
  const { authenticated } = useContext(Auth);
  const location = useLocation();

  if (!authenticated) {
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  return <>{children}</>;
};

function AppRoutes() {
  const { authenticated } = useContext(Auth);

  return (
    <Routes>
      <Route path="/" element={
        authenticated ? <Navigate to="/home" replace /> : <Navigate to="/login" replace />
      } />
      <Route path="/login" element={
        !authenticated ? <LoginPage /> : <Navigate to="/home" replace />
      } />
      <Route path="/home" element={
        <ProtectedRoute>
          <Homepage />
        </ProtectedRoute>
      } />
      <Route path="/profile" element={
        <ProtectedRoute>
          <ProfilePage />
        </ProtectedRoute>
      } />
      <Route path="/new-task" element={<CreateTaskPage />} />
      <Route path="/tasks" element={<TasksPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route path="/:spaceSlug" element={<SpacePage />} />
      <Route path="/tasks/:taskId" element={ <TaskDataPage /> } />

    </Routes>
  );
}

function App() {
  const token = TokenStorage.getInstance().getAccessToken() ? true : false;
  const prefersDarkMode = useMediaQuery('(prefers-color-scheme: dark)');
  const [themeMode, setTheme] = useState(prefersDarkMode);

  const themeContext: ThemeModeInterface = {
    theme: themeMode,
    toggleTheme: setTheme
  };

  const theme = createTheme(themeContext.theme ? DarkTheme : LightTheme);

  return (
    <div className="App">
      <AuthProvider defaultAuthenticated={token}>
        <ThemeMode.Provider value={themeContext}>
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <Header/>
            <AppRoutes />
            <Footer/>
          </ThemeProvider>
        </ThemeMode.Provider>
      </AuthProvider>
    </div>
  );
}

export default App;