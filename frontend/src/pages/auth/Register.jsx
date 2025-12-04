import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { authService } from '../../services/authService';
import { Link } from 'react-router-dom';
import { User, Mail, Lock, Briefcase, Shield, CheckCircle, Copy } from 'lucide-react';
import toast from 'react-hot-toast';

export default function Register() {
    const { register, handleSubmit, watch, formState: { errors } } = useForm();

    // State to store the generated ID after success
    const [successData, setSuccessData] = useState(null);

    const onSubmit = async (data) => {
        try {
            const response = await authService.register(data);
            // Backend now returns: { message: "...", userId: "APPLICANT-5" }
            setSuccessData({
                id: response.userId,
                name: data.fullName
            });
            toast.success("Account Created!");
        } catch (error) {
            console.error(error);
            toast.error(error.response?.data?.message || "Registration Failed");
        }
    };

    // --- SUCCESS VIEW (Shows after submitting) ---
    if (successData) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4">
                <div className="max-w-md w-full bg-white rounded-2xl shadow-xl p-8 text-center">
                    <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 mb-6">
                        <CheckCircle className="h-8 w-8 text-green-600" />
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900">Registration Successful!</h2>
                    <p className="text-gray-500 mt-2">Welcome to HDFC SME Portal, {successData.name}.</p>

                    <div className="mt-8 bg-blue-50 border border-blue-200 rounded-lg p-6">
                        <p className="text-sm text-blue-800 font-medium uppercase tracking-wider mb-2">Your User ID</p>
                        <div className="flex items-center justify-center gap-3">
              <span className="text-3xl font-mono font-bold text-blue-900 tracking-tight">
                {successData.id}
              </span>
                        </div>
                        <p className="text-xs text-blue-600 mt-2">
                            Please save this ID. You will need it to login.
                        </p>
                    </div>

                    <div className="mt-8">
                        <Link
                            to="/login"
                            className="block w-full py-3 px-4 bg-blue-700 text-white rounded-lg font-bold shadow-md hover:bg-blue-800 transition-colors"
                        >
                            Proceed to Login
                        </Link>
                    </div>
                </div>
            </div>
        );
    }

    // --- REGISTRATION FORM VIEW (Default) ---
    return (
        <div className="min-h-screen flex items-center justify-center bg-gray-100 px-4 sm:px-6 lg:px-8">
            <div className="max-w-lg w-full bg-white rounded-2xl shadow-xl overflow-hidden">
                <div className="bg-blue-900 py-6 px-8 text-center relative">
                    <h2 className="text-2xl font-bold text-white tracking-wide">Create Account</h2>
                    <p className="text-blue-200 mt-1 text-sm">Join the SME Pre-Screen Portal</p>
                </div>

                <div className="p-8">
                    <form onSubmit={handleSubmit(onSubmit)} className="space-y-5">
                        {/* Full Name */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Full Name</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <User className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="text"
                                    {...register("fullName", { required: "Full name is required" })}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="John Doe"
                                />
                            </div>
                        </div>

                        {/* Email */}
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

                        {/* Role */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">I am a...</label>
                            <div className="grid grid-cols-2 gap-4">
                                <label className="relative flex flex-col items-center p-4 border rounded-lg cursor-pointer hover:bg-blue-50 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50">
                                    <input type="radio" {...register("role", { required: true })} value="APPLICANT" className="absolute opacity-0" />
                                    <Briefcase className="h-6 w-6 text-blue-600 mb-2" />
                                    <span className="text-sm font-medium">Applicant</span>
                                </label>
                                <label className="relative flex flex-col items-center p-4 border rounded-lg cursor-pointer hover:bg-blue-50 has-[:checked]:border-blue-600 has-[:checked]:bg-blue-50">
                                    <input type="radio" {...register("role", { required: true })} value="STAFF" className="absolute opacity-0" />
                                    <Shield className="h-6 w-6 text-blue-600 mb-2" />
                                    <span className="text-sm font-medium">Bank Staff</span>
                                </label>
                            </div>
                        </div>

                        {/* Password */}
                        <div>
                            <label className="block text-sm font-semibold text-gray-700 mb-1">Password</label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                    <Lock className="h-5 w-5 text-gray-400" />
                                </div>
                                <input
                                    type="password"
                                    {...register("password", { required: "Password is required" })}
                                    className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                                    placeholder="Create a password"
                                />
                            </div>
                        </div>

                        <button type="submit" className="w-full py-3 px-4 bg-blue-700 text-white rounded-lg font-bold shadow-md hover:bg-blue-800 transition-colors">
                            Create Account
                        </button>
                    </form>

                    <div className="mt-6 text-center border-t border-gray-100 pt-4">
                        <p className="text-sm text-gray-600">
                            Already have an ID? <Link to="/login" className="font-bold text-blue-700 hover:text-blue-900">Sign In</Link>
                        </p>
                    </div>
                </div>
            </div>
        </div>
    );
}