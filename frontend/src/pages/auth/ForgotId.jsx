import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { authService } from '../../services/authService';
import { Link } from 'react-router-dom';
import { Mail, ArrowLeft, Search, UserCheck } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ForgotId() {
    const { register, handleSubmit, formState: { errors } } = useForm();
    const [retrievedUser, setRetrievedUser] = useState(null);

    const onSubmit = async (data) => {
        try {
            const response = await authService.fetchUserId(data.email);
            setRetrievedUser(response);
            toast.success("User ID Found!");
        } catch (error) {
            toast.error("No account found with that email.");
        }
    };

    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
            <div className="max-w-md w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-blue-900 py-6 px-8 text-center">
                    <h2 className="text-2xl font-bold text-white">Recover User ID</h2>
                    <p className="text-blue-200 mt-1 text-sm">Enter your registered email</p>
                </div>

                <div className="p-8">
                    {!retrievedUser ? (
                        <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                            <div>
                                <label className="block text-sm font-semibold text-gray-700 mb-1">Email Address</label>
                                <div className="relative">
                                    <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                        <Mail className="h-5 w-5 text-gray-400" />
                                    </div>
                                    <input
                                        type="email"
                                        {...register("email", { required: "Email is required" })}
                                        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                        placeholder="john@example.com"
                                    />
                                </div>
                            </div>

                            <button type="submit" className="w-full flex justify-center items-center gap-2 py-3 px-4 bg-blue-700 text-white rounded-lg font-bold shadow-md hover:bg-blue-800 transition-colors">
                                <Search size={18} /> Find My ID
                            </button>
                        </form>
                    ) : (
                        <div className="text-center animate-fade-in">
                            <div className="mx-auto flex items-center justify-center h-14 w-14 rounded-full bg-blue-100 mb-4">
                                <UserCheck className="h-7 w-7 text-blue-600" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900">Account Found</h3>
                            <p className="text-sm text-gray-500 mb-6">Hello, {retrievedUser.fullName}</p>

                            <div className="bg-gray-50 border border-gray-200 rounded p-4 mb-6">
                                <p className="text-xs text-gray-500 uppercase tracking-wide">Your User ID</p>
                                <p className="text-2xl font-mono font-bold text-blue-700 mt-1">{retrievedUser.userId}</p>
                            </div>

                            <Link to="/login" className="block w-full py-3 bg-blue-700 text-white rounded-lg font-bold hover:bg-blue-800">
                                Login Now
                            </Link>
                        </div>
                    )}

                    <div className="mt-6 text-center border-t border-gray-100 pt-4">
                        <Link to="/login" className="flex items-center justify-center gap-2 text-sm text-gray-600 hover:text-blue-700">
                            <ArrowLeft size={16} /> Back to Login
                        </Link>
                    </div>
                </div>
            </div>
        </div>
    );
}