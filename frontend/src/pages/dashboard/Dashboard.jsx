import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { appService } from '../../services/appService';
import { DashboardSkeleton } from '../../components/common/Skeletons';
import { PlusCircle, FileText, IndianRupee, Clock, LogOut, Menu, X, ChevronRight } from 'lucide-react';

const StatusBadge = ({ status }) => {
    const styles = {
        ELIGIBLE: "bg-green-100 text-green-800 border-green-200",
        INELIGIBLE: "bg-red-100 text-red-800 border-red-200",
        PENDING: "bg-yellow-100 text-yellow-800 border-yellow-200",
        READY: "bg-blue-100 text-blue-800 border-blue-200",
        BLOCKED_MISSING_DOCS: "bg-orange-100 text-orange-800 border-orange-200",
        BLOCKED_INELIGIBLE: "bg-red-50 text-red-600 border-red-200"
    };
    return (
        <span className={`px-2.5 py-0.5 inline-flex text-xs font-bold rounded-full border ${styles[status] || "bg-gray-100 text-gray-800"}`}>
      {status?.replace(/_/g, " ")}
    </span>
    );
};

export default function Dashboard() {
    const { user, isStaff, logout } = useAuth();
    const [apps, setApps] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for Mobile Menu

    useEffect(() => {
        loadApplications();
    }, []);

    const loadApplications = async () => {
        try {
            const data = await appService.getAll();
            setApps(data);
        } catch (error) {
            console.error("Failed to load apps", error);
        } finally {
            setLoading(false);
        }
    };

    if (loading) return <DashboardSkeleton />;

    return (
        <div className="min-h-screen bg-gray-50">

            {/* --- ADAPTIVE NAVBAR --- */}
            <nav className="bg-blue-900 text-white shadow-lg sticky top-0 z-50">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex justify-between h-16 items-center">

                        {/* Logo Section */}
                        <div className="flex items-center gap-3">
                            <div className="w-9 h-9 bg-white rounded-lg flex items-center justify-center text-blue-900 font-bold shadow-sm">
                                H
                            </div>
                            <span className="text-xl font-bold tracking-tight">SME Pre-Screen</span>
                        </div>

                        {/* Desktop Actions (Hidden on Mobile) */}
                        <div className="hidden md:flex items-center gap-6">
                            <div className="text-right">
                                <p className="text-sm font-semibold">{user?.fullName}</p>
                                <p className="text-xs text-blue-200 uppercase tracking-wider">{isStaff ? 'Bank Staff' : 'Applicant'}</p>
                            </div>
                            <button
                                onClick={logout}
                                className="p-2 bg-blue-800 rounded-full hover:bg-blue-700 transition-colors shadow-sm"
                                title="Logout"
                            >
                                <LogOut size={18} />
                            </button>
                        </div>

                        {/* Mobile Menu Button (Visible only on Mobile) */}
                        <div className="flex md:hidden">
                            <button
                                onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
                                className="p-2 text-blue-200 hover:text-white"
                            >
                                {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
                            </button>
                        </div>
                    </div>
                </div>

                {/* Mobile Menu Dropdown */}
                {isMobileMenuOpen && (
                    <div className="md:hidden bg-blue-800 px-4 pt-2 pb-4 space-y-3 border-t border-blue-700 animate-fade-in">
                        <div className="flex items-center gap-3 pb-3 border-b border-blue-700">
                            <div className="h-10 w-10 rounded-full bg-blue-600 flex items-center justify-center text-lg font-bold">
                                {user?.fullName.charAt(0)}
                            </div>
                            <div>
                                <p className="font-medium">{user?.fullName}</p>
                                <p className="text-xs text-blue-300">{user?.email}</p>
                            </div>
                        </div>
                        <button
                            onClick={logout}
                            className="w-full flex items-center gap-2 px-3 py-2 rounded-md text-base font-medium text-blue-100 hover:text-white hover:bg-blue-700"
                        >
                            <LogOut size={18} /> Sign Out
                        </button>
                    </div>
                )}
            </nav>

            {/* --- MAIN CONTENT --- */}
            <main className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">

                {/* Adaptive Header: Stacks on mobile, row on desktop */}
                <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
                    <div>
                        <h2 className="text-2xl font-bold text-gray-900">
                            {isStaff ? 'Application Queue' : 'My Applications'}
                        </h2>
                        <p className="text-gray-500 mt-1 text-sm">
                            {isStaff ? 'Manage incoming loan requests.' : 'Track the status of your loans.'}
                        </p>
                    </div>

                    {!isStaff && (
                        <Link
                            to="/application/new"
                            className="w-full md:w-auto flex items-center justify-center gap-2 bg-blue-600 text-white px-5 py-2.5 rounded-lg hover:bg-blue-700 transition shadow-sm font-medium"
                        >
                            <PlusCircle size={18} /> New Application
                        </Link>
                    )}
                </div>

                {/* Application List - Adaptive Card View */}
                <div className="bg-white shadow-sm border border-gray-200 rounded-xl overflow-hidden">
                    {apps.length === 0 ? (
                        <div className="p-12 text-center">
                            <div className="mx-auto h-12 w-12 text-gray-400 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                                <FileText />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900">No applications yet</h3>
                        </div>
                    ) : (
                        <ul className="divide-y divide-gray-100">
                            {apps.map((app) => (
                                <li key={app.id} className="hover:bg-blue-50/50 transition-colors group">
                                    <Link to={`/application/${app.id}`} className="block p-5 sm:px-6">

                                        {/* Flex Container for Card Content */}
                                        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">

                                            {/* Left: Info */}
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center justify-between sm:justify-start gap-3 mb-1">
                                                    <p className="text-lg font-bold text-blue-900 truncate">
                                                        {app.applicantName}
                                                    </p>
                                                    {/* Badge shows on right for mobile, inline for desktop */}
                                                    <div className="sm:hidden"><StatusBadge status={app.eligibilityStatus} /></div>
                                                </div>

                                                <p className="text-sm text-gray-500 mb-2">{app.businessType}</p>

                                                <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm text-gray-500">
                                                    <span className="flex items-center"><IndianRupee size={14} className="mr-1"/> {app.requestedLoanAmount?.toLocaleString('en-IN')}</span>
                                                    <span className="flex items-center"><Clock size={14} className="mr-1"/> {app.turnoverBand} Turnover</span>
                                                </div>
                                            </div>

                                            {/* Right: Status & Chevron (Desktop only) */}
                                            <div className="flex items-center gap-4">
                                                <div className="hidden sm:block">
                                                    <StatusBadge status={app.eligibilityStatus} />
                                                </div>
                                                <ChevronRight className="text-gray-300 group-hover:text-blue-500 transition-colors" />
                                            </div>
                                        </div>
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    )}
                </div>
            </main>
        </div>
    );
}