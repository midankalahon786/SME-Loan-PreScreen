import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import { Toaster } from 'react-hot-toast';
import Login from './pages/auth/Login';
import Dashboard from './pages/dashboard/Dashboard'; // You'll create this next
import PrivateRoute from './components/layout/PrivateRoute'; // See below
import Register from './pages/auth/Register';
import ForgotId from './pages/auth/ForgotId';
import NewApplication from './pages/application/NewApplication';
import ApplicationDetails from './pages/application/ApplicationDetails';

function App() {
    return (
        <Router>
            <AuthProvider>
                <Toaster position="top-right" />
                <Routes>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-id" element={<ForgotId />} />
                    <Route path="/application/new" element={<NewApplication />} />
                    <Route path="/application/:id" element={<ApplicationDetails />} />

                    {/* Protected Routes */}
                    <Route element={<PrivateRoute />}>
                        <Route path="/dashboard" element={<Dashboard />} />
                        <Route path="/" element={<Dashboard />} />
                    </Route>

                </Routes>
            </AuthProvider>
        </Router>
    );
}

export default App;