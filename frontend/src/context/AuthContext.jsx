import { createContext, useContext, useState, useEffect } from 'react';
import { authService } from '../services/authService';
import toast from 'react-hot-toast';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    // Check if user is already logged in on page load
    useEffect(() => {
        const storedUser = localStorage.getItem('user');
        const token = localStorage.getItem('token');
        if (storedUser && token) {
            setUser(JSON.parse(storedUser));
        }
        setLoading(false);
    }, []);

    const login = async (username, password) => {
        try {
            const data = await authService.login(username, password);
            setUser(data.user);
            toast.success(`Welcome back, ${data.user.fullName}!`);
            return true; // Login success
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Invalid ID or Password");
            return false; // Login failed
        }
    };

    const register = async (formData) => {
        try {
            await authService.register(formData);
            toast.success("Registration successful! Please login.");
            return true;
        } catch (error) {
            toast.error(error.response?.data || "Registration failed");
            return false;
        }
    };

    const logout = () => {
        authService.logout();
        setUser(null);
        toast.success("Logged out successfully");
    };

    // Helper to check role
    const isStaff = user?.role === 'STAFF';

    return (
        <AuthContext.Provider value={{ user, login, register, logout, isStaff, loading }}>
            {!loading && children}
        </AuthContext.Provider>
    );
};

export const useAuth = () => useContext(AuthContext);