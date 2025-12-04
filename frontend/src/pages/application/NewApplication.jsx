import { useForm } from 'react-hook-form';
import { useNavigate } from 'react-router-dom';
import { appService } from '../../services/appService';
import { ArrowLeft, CheckCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function NewApplication() {
    const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm();
    const navigate = useNavigate();

    const onSubmit = async (data) => {
        try {
            await appService.create(data);
            toast.success("Application started!");
            navigate('/dashboard'); // Go back to dashboard to see new item
        } catch (error) {
            toast.error("Failed to create application");
        }
    };

    return (
        <div className="min-h-screen bg-gray-50 py-8 px-4 sm:px-6 lg:px-8">
            <div className="max-w-3xl mx-auto">

                {/* Header */}
                <div className="mb-6 flex items-center gap-2">
                    <button onClick={() => navigate('/dashboard')} className="p-2 rounded-full hover:bg-gray-200 transition">
                        <ArrowLeft size={20} className="text-gray-600"/>
                    </button>
                    <h1 className="text-2xl font-bold text-gray-900">New Loan Application</h1>
                </div>

                {/* Adaptive Form Card */}
                <div className="bg-white shadow-lg rounded-xl overflow-hidden">
                    <div className="bg-blue-900 px-6 py-4">
                        <h3 className="text-white font-medium">Basic Information</h3>
                        <p className="text-blue-200 text-xs mt-1">Please provide accurate business details for pre-screening.</p>
                    </div>

                    <form onSubmit={handleSubmit(onSubmit)} className="p-6 sm:p-8">
                        {/* GRID LAYOUT: 1 column on mobile, 2 columns on 'sm' (tablet+) */}
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">

                            {/* Full Width Field */}
                            <div className="sm:col-span-2">
                                <label className="block text-sm font-semibold text-gray-700">Applicant / Company Name</label>
                                <input
                                    type="text"
                                    {...register("applicantName", { required: "Name is required" })}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5"
                                    placeholder="e.g. Acme Traders Pvt Ltd"
                                />
                                {errors.applicantName && <p className="text-red-500 text-xs mt-1">{errors.applicantName.message}</p>}
                            </div>

                            {/* Half Width Field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Business Type</label>
                                <select
                                    {...register("businessType", { required: true })}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5 bg-white"
                                >
                                    <option value="">Select Type</option>
                                    <option value="PROPRIETORSHIP">Proprietorship</option>
                                    <option value="PARTNERSHIP">Partnership</option>
                                    <option value="PVT_LTD">Pvt Ltd Company</option>
                                </select>
                            </div>

                            {/* Half Width Field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Years in Business</label>
                                <input
                                    type="number"
                                    {...register("yearsInBusiness", { required: true, min: 0 })}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5"
                                />
                            </div>

                            {/* Half Width Field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Annual Turnover</label>
                                <select
                                    {...register("turnoverBand", { required: true })}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5 bg-white"
                                >
                                    <option value="">Select Band</option>
                                    <option value="0-50L">₹0 - ₹50 Lakhs</option>
                                    <option value="50L-1Cr">₹50 Lakhs - ₹1 Crore</option>
                                    <option value="1Cr-5Cr">₹1 Crore - ₹5 Crore</option>
                                    <option value="5Cr+">Above ₹5 Crore</option>
                                </select>
                            </div>

                            {/* Half Width Field */}
                            <div>
                                <label className="block text-sm font-semibold text-gray-700">Loan Amount Required (₹)</label>
                                <input
                                    type="number"
                                    {...register("requestedLoanAmount", { required: true, min: 10000 })}
                                    className="mt-1 block w-full rounded-lg border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 border p-2.5"
                                    placeholder="200000"
                                />
                            </div>
                        </div>

                        {/* Footer Actions */}
                        <div className="mt-8 flex justify-end">
                            <button
                                type="submit"
                                disabled={isSubmitting}
                                className="w-full sm:w-auto flex justify-center items-center gap-2 bg-blue-600 text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition disabled:opacity-50 shadow-md"
                            >
                                {isSubmitting ? 'Processing...' : (
                                    <>Create Application <CheckCircle size={18} /></>
                                )}
                            </button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}