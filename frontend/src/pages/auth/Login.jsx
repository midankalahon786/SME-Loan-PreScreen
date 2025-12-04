import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { useAuth } from '../../context/AuthContext';
import { useNavigate, Link } from 'react-router-dom';
import { Lock, User, ShieldCheck, Eye, EyeOff } from 'lucide-react'; // Import Eye icons

export default function Login() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const { login } = useAuth();
    const navigate = useNavigate();

    // State for toggling password visibility
    const [showPassword, setShowPassword] = useState(false);

    const onSubmit = async (data) => {
        const success = await login(data.username, data.password);
        if (success) navigate('/dashboard');
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">

                {/* Header */}
                <div className="bg-blue-900 py-8 px-8 text-center relative overflow-hidden">
                    <div className="absolute top-[-20px] left-[-20px] w-24 h-24 bg-blue-800 rounded-full opacity-50"></div>
                    <div className="flex justify-center mb-4">
                        <div className="bg-white p-3 rounded-full shadow-lg">
                            <ShieldCheck className="h-8 w-8 text-blue-900" />
                        </div>
                    </div>
                    <h2 className="text-3xl font-bold text-white tracking-wide">SME Pre-Screen</h2>
                    <p className="text-blue-200 mt-2 text-sm font-medium uppercase tracking-wider">Secure Banking Portal</p>
                </div>

                <div className="p-8 pt-10">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                        {/* User ID */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">User ID</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    {...register("username", { required: "User ID is required" })}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g. APPLICANT-1"
                                />
                            </div>
                            {errors.username && <p className="text-red-500 text-xs mt-1">{errors.username.message}</p>}
                        </div>

                        {/* Password with Visibility Toggle */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type={showPassword ? "text" : "password"} // Dynamic Type
                                    {...register("password", { required: "Password is required" })}
                                    className="block w-full pl-10 pr-10 py-3 border border-gray-300 rounded-lg text-gray-900 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                    placeholder="••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPassword(!showPassword)}
                                    className="absolute inset-y-0 right-0 pr-3 flex items-center text-gray-400 hover:text-gray-600"
                                >
                                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                                </button>
                            </div>
                            {errors.password && <p className="text-red-500 text-xs mt-1">{errors.password.message}</p>}
                        </div>

                        <button
                            type="submit"
                            className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-bold text-white bg-blue-700 hover:bg-blue-800 transition-transform transform active:scale-95"
                        >
                            Sign In to Portal
                        </button>
                    </form>

                    <div className="mt-8 pt-6 border-t border-gray-100 text-center flex justify-between items-center">
                        <Link to="/forgot-id" className="text-sm font-medium text-blue-600 hover:text-blue-500">
                            Forgot User ID?
                        </Link>
                        <Link to="/register" className="text-sm font-bold text-blue-700 hover:text-blue-900">
                            Register Now
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}