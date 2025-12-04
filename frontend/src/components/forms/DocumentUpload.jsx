import { useState } from 'react';
import { docService } from '../../services/docService';

export default function DocumentUpload({ applicationId }) {
    const [file, setFile] = useState(null);

    const handleUpload = async () => {
        if (!file) return;
        try {
            // "ITR" matches your DocumentType enum
            await docService.uploadDocument(applicationId, file, "ITR");
            alert("Uploaded!");
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-brand-500 transition-colors">
            <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="mb-4"
            />
            <button
                onClick={handleUpload}
                className="bg-brand-600 text-white px-4 py-2 rounded shadow hover:bg-brand-700"
            >
                Upload ITR / Financial Docs
            </button>
        </div>
    );
}