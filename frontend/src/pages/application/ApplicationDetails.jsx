import { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { appService } from '../../services/appService';
import { docService } from '../../services/docService';
import { msgService } from '../../services/msgService';
import { getDocsByCategory } from '../../utils/docConstants';
import { DetailsSkeleton } from '../../components/common/Skeletons';
import { ArrowLeft, UploadCloud, CheckCircle,Eye, FileText, Loader, Trash2, Send, MessageSquare, ShieldCheck, AlertCircle, XCircle } from 'lucide-react';
import toast from 'react-hot-toast';

export default function ApplicationDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user, isStaff } = useAuth();

    const [app, setApp] = useState(null);
    const [uploadedDocs, setUploadedDocs] = useState([]);
    const [comments, setComments] = useState([]);
    const [newMessage, setNewMessage] = useState("");
    const [loading, setLoading] = useState(true);
    const [uploading, setUploading] = useState(null);

    // Auto-scroll to bottom of chat
    const chatEndRef = useRef(null);

    useEffect(() => {
        loadData();
    }, [id]);

    useEffect(() => {
        // Scroll to bottom whenever comments change
        chatEndRef.current?.scrollIntoView({ behavior: "smooth" });
    }, [comments]);

    const loadData = async () => {
        try {
            const [appData, docsData, commentsData] = await Promise.all([
                appService.getById(id),
                docService.list(id),
                msgService.getComments(id)
            ]);
            setApp(appData);
            setUploadedDocs(docsData);
            setComments(commentsData);
        } catch (error) {
            toast.error("Failed to load application data");
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async () => {
        if (!window.confirm("Are you sure you want to delete this application?")) return;
        try {
            await appService.delete(id);
            toast.success("Application deleted");
            navigate('/dashboard');
        } catch (error) {
            toast.error("Failed to delete application");
        }
    };

    const handleSendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim()) return;
        try {
            const addedComment = await msgService.postComment(id, newMessage);
            setComments([addedComment, ...comments]);
            setNewMessage("");
        } catch (error) {
            toast.error("Failed to send message");
        }
    };

    const handleUpload = async (docType, file) => {
        if (!file) return;
        setUploading(docType);
        try {
            await docService.upload(id, docType, file);
            toast.success("Document Uploaded!");
            const updatedDocs = await docService.list(id);
            setUploadedDocs(updatedDocs);
        } catch (error) {
            toast.error("Upload failed");
        } finally {
            setUploading(null);
        }
    };

    const handleVerify = async (docId, status) => {
        try {
            await docService.verify(id, docId, status);
            toast.success(`Document ${status}`);
            // Refresh list to show new badge
            const updatedDocs = await docService.list(id);
            setUploadedDocs(updatedDocs);
        } catch (error) {
            console.error(error);
            toast.error("Failed to update status");
        }
    };

    const handlePreview = async (docId) => {
        try {
            const blob = await docService.getPreview(id, docId);

            // Create a local URL for the binary data
            const fileURL = URL.createObjectURL(blob);

            // Open in new tab
            window.open(fileURL, '_blank');
        } catch (error) {
            console.error(error);
            toast.error("Could not preview file. It might be missing from the server.");
        }
    };

    if (loading) return <DetailsSkeleton />;

    return (
        <div className="min-h-screen bg-gray-50 pb-12">
            {/* Header */}
            <div className="bg-blue-900 text-white pt-8 pb-12 px-4 sm:px-8 shadow-lg">
                <div className="max-w-6xl mx-auto">
                    <div className="flex justify-between items-center mb-4">
                        <button onClick={() => navigate('/dashboard')} className="flex items-center gap-2 text-blue-200 hover:text-white transition">
                            <ArrowLeft size={18} /> Back to Dashboard
                        </button>

                        {/* DELETE BUTTON (Visible to Staff Only) */}
                        {isStaff && (
                            <button
                                onClick={handleDelete}
                                className="flex items-center gap-2 px-3 py-1.5 bg-red-600 hover:bg-red-700 text-white text-sm font-bold rounded-lg transition-colors shadow-sm"
                            >
                                <Trash2 size={16} /> Delete App
                            </button>
                        )}
                    </div>

                    <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                        <div>
                            <h1 className="text-3xl font-bold">{app?.applicantName}</h1>
                            <p className="text-blue-200 mt-1 flex items-center gap-2">
                                <span className="bg-blue-800 px-2 py-0.5 rounded text-xs tracking-wide uppercase">{app?.businessType}</span>
                                <span>• Request: ₹{app?.requestedLoanAmount?.toLocaleString()}</span>
                            </p>
                        </div>
                        <div className="bg-white/10 px-4 py-2 rounded-lg border border-white/20">
                            <p className="text-xs text-blue-200 uppercase">Status</p>
                            <p className="font-bold">{app?.preScreenResult?.replace(/_/g, " ")}</p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Grid */}
            <div className="max-w-6xl mx-auto px-4 sm:px-8 -mt-8 grid grid-cols-1 lg:grid-cols-3 gap-8">

                {/* --- LEFT: DOCUMENTS --- */}
                <div className="lg:col-span-2 space-y-6">
                    <DocCategorySection
                        title="KYC Documents"
                        category="KYC"
                        uploadedDocs={uploadedDocs}
                        onUpload={handleUpload}
                        uploadingType={uploading}
                        isStaff={isStaff}       // <--- PASSED HERE
                        onVerify={handleVerify} // <--- PASSED HERE
                        onPreview={handlePreview}
                    />
                    <DocCategorySection
                        title="Income Proof"
                        category="INCOME"
                        uploadedDocs={uploadedDocs}
                        onUpload={handleUpload}
                        uploadingType={uploading}
                        isStaff={isStaff}       // <--- PASSED HERE
                        onVerify={handleVerify} // <--- PASSED HERE
                        onPreview={handlePreview}
                    />
                    <DocCategorySection
                        title="Business Proof"
                        category="BUSINESS"
                        uploadedDocs={uploadedDocs}
                        onUpload={handleUpload}
                        uploadingType={uploading}
                        isStaff={isStaff}       // <--- PASSED HERE
                        onVerify={handleVerify} // <--- PASSED HERE
                        onPreview={handlePreview}
                    />
                </div>

                {/* --- RIGHT: MESSAGING --- */}
                <div className="lg:col-span-1">
                    <div className="bg-white rounded-xl shadow-md overflow-hidden sticky top-24 flex flex-col h-[500px]">
                        <div className="bg-gray-50 px-4 py-3 border-b border-gray-100 flex items-center gap-2">
                            <MessageSquare size={18} className="text-blue-600"/>
                            <h3 className="font-bold text-gray-800">Messages</h3>
                        </div>

                        {/* Messages List */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-50/50 flex flex-col-reverse">
                            <div ref={chatEndRef} />
                            {comments.length === 0 ? (
                                <p className="text-center text-sm text-gray-400 mt-10">
                                    {isStaff ? "Send a note to the applicant." : "Ask a question to the bank staff."}
                                </p>
                            ) : (
                                comments.map((msg) => {
                                    const isMe = (isStaff && msg.authorRole === 'STAFF') ||
                                        (!isStaff && msg.authorRole === 'APPLICANT');

                                    return (
                                        <div key={msg.id} className={`flex flex-col ${isMe ? 'items-end' : 'items-start'}`}>
                                            <div className={`max-w-[85%] px-3 py-2 rounded-lg text-sm shadow-sm ${
                                                isMe
                                                    ? 'bg-blue-600 text-white rounded-br-none'
                                                    : 'bg-white text-gray-800 border border-gray-200 rounded-bl-none'
                                            }`}>
                                                <p className={`font-bold text-[10px] mb-0.5 opacity-75 ${isMe ? 'text-blue-100' : 'text-gray-500'}`}>
                                                    {msg.authorName}
                                                </p>
                                                <p>{msg.message}</p>
                                            </div>
                                            <span className="text-[10px] text-gray-400 mt-1">
                                        {new Date(msg.createdAt).toLocaleString()}
                                    </span>
                                        </div>
                                    );
                                })
                            )}
                        </div>

                        {/* Input Area */}
                        <form onSubmit={handleSendMessage} className="p-3 border-t border-gray-100 bg-white">
                            <div className="relative">
                                <input
                                    type="text"
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    placeholder="Type your message..."
                                    className="w-full pl-3 pr-10 py-2 border border-gray-300 rounded-full text-sm focus:outline-none focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                                />
                                <button
                                    type="submit"
                                    className="absolute right-1 top-1 p-1.5 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition"
                                >
                                    <Send size={14} />
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    );
}

// Child Component
function DocCategorySection({ title, category, uploadedDocs, onUpload, uploadingType, isStaff, onVerify, onPreview }) {
    const requirements = getDocsByCategory(category);

    return (
        <div className="bg-white rounded-xl shadow-md overflow-hidden">
            <div className="bg-gray-50 px-6 py-4 border-b border-gray-100 flex items-center gap-2">
                <FileText size={20} className="text-blue-600"/>
                <h3 className="font-bold text-gray-800 text-lg">{title}</h3>
            </div>

            <div className="divide-y divide-gray-100">
                {requirements.map((req) => {
                    const existing = uploadedDocs.find(d => d.docType === req.type);
                    const isUploading = uploadingType === req.type;

                    let statusColor = "text-green-600 bg-green-50 border-green-200";
                    let statusIcon = <CheckCircle size={16} />;
                    let statusText = "Uploaded";

                    if (existing?.status === 'VERIFIED') {
                        statusColor = "text-blue-700 bg-blue-50 border-blue-200";
                        statusIcon = <ShieldCheck size={16} />;
                        statusText = "Verified";
                    } else if (existing?.status === 'REJECTED') {
                        statusColor = "text-red-700 bg-red-50 border-red-200";
                        statusIcon = <AlertCircle size={16} />;
                        statusText = "Rejected";
                    }

                    return (
                        <div key={req.type} className="p-5 sm:px-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-gray-50 transition">
                            <div>
                                <div className="flex items-center gap-2">
                                    <p className="font-medium text-gray-900">{req.label}</p>
                                    {req.mandatory && <span className="text-[10px] font-bold bg-red-100 text-red-600 px-1.5 py-0.5 rounded">REQUIRED</span>}
                                </div>
                                {existing ? (
                                    <p className="text-xs text-gray-500 mt-1 flex items-center gap-1">
                                        Doc ID: #{existing.id} • {new Date(existing.uploadedAt).toLocaleDateString()}
                                    </p>
                                ) : (
                                    <p className="text-xs text-gray-400 mt-1">Format: PDF, JPG (Max 5MB)</p>
                                )}
                            </div>

                            <div>
                                {existing ? (
                                    <div className="flex items-center gap-3">

                                        {/* --- NEW: PREVIEW BUTTON ADDED HERE --- */}
                                        <button
                                            onClick={() => onPreview(existing.id)}
                                            title="Preview Document"
                                            className="p-1.5 bg-white border border-gray-200 hover:bg-gray-100 text-gray-500 hover:text-blue-600 rounded-lg transition shadow-sm"
                                        >
                                            <Eye size={18} />
                                        </button>
                                        {/* -------------------------------------- */}

                                        <div className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-sm font-bold ${statusColor}`}>
                                            {statusIcon} {statusText}
                                        </div>

                                        {isStaff && existing.status === 'UPLOADED' && (
                                            <div className="flex items-center gap-1 bg-white border border-gray-200 rounded-lg p-1 shadow-sm">
                                                <button
                                                    onClick={() => onVerify(existing.id, 'VERIFIED')}
                                                    title="Approve Document"
                                                    className="p-1.5 hover:bg-green-100 text-gray-400 hover:text-green-600 rounded transition"
                                                >
                                                    <CheckCircle size={18} />
                                                </button>
                                                <div className="w-px h-4 bg-gray-200"></div>
                                                <button
                                                    onClick={() => onVerify(existing.id, 'REJECTED')}
                                                    title="Reject Document"
                                                    className="p-1.5 hover:bg-red-100 text-gray-400 hover:text-red-600 rounded transition"
                                                >
                                                    <XCircle size={18} />
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                ) : (
                                    <div className="relative">
                                        <input
                                            type="file"
                                            id={`file-${req.type}`}
                                            className="hidden"
                                            onChange={(e) => onUpload(req.type, e.target.files[0])}
                                            disabled={isUploading || isStaff}
                                        />
                                        <label
                                            htmlFor={`file-${req.type}`}
                                            className={`flex items-center gap-2 px-4 py-2 rounded-lg border text-sm font-medium transition-all ${
                                                isStaff
                                                    ? "bg-gray-100 text-gray-400 cursor-not-allowed"
                                                    : "cursor-pointer bg-white text-blue-600 border-blue-200 hover:bg-blue-50 hover:border-blue-300"
                                            }`}
                                        >
                                            {isUploading ? <Loader className="animate-spin" size={16}/> : <UploadCloud size={16} />}
                                            {isUploading ? "..." : "Upload"}
                                        </label>
                                    </div>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>
        </div>
    );
}