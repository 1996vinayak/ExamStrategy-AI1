import React, { ChangeEvent } from 'react';
import { UploadedFile } from '../types';
import { formatFileSize, fileToBase64 } from '../utils/fileUtils';
import { Upload, X, FileText, BookOpen, Layers } from 'lucide-react';

interface FileUploadSectionProps {
  files: UploadedFile[];
  setFiles: React.Dispatch<React.SetStateAction<UploadedFile[]>>;
}

export const FileUploadSection: React.FC<FileUploadSectionProps> = ({ files, setFiles }) => {
  
  const handleFileChange = async (e: ChangeEvent<HTMLInputElement>, type: 'syllabus' | 'pyq' | 'book') => {
    if (e.target.files) {
      const newFiles: UploadedFile[] = [];
      
      for (let i = 0; i < e.target.files.length; i++) {
        const file = e.target.files[i];
        // Basic validation for PDF/Images
        if (file.type !== 'application/pdf' && !file.type.startsWith('image/')) {
            alert(`File ${file.name} is not supported. Please upload PDFs or Images.`);
            continue;
        }

        try {
            const base64 = await fileToBase64(file);
            newFiles.push({
                id: Math.random().toString(36).substr(2, 9),
                file: file,
                type: type,
                base64: base64
            });
        } catch (error) {
            console.error("Error processing file", file.name, error);
        }
      }
      setFiles(prev => [...prev, ...newFiles]);
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
  };

  const renderFileList = (type: 'syllabus' | 'pyq' | 'book', title: string, icon: React.ReactNode) => {
    const typeFiles = files.filter(f => f.type === type);
    return (
      <div className="mb-6">
        <h3 className="text-sm font-semibold text-slate-700 mb-2 flex items-center gap-2">
          {icon} {title}
        </h3>
        <div className="space-y-2">
            {typeFiles.map(file => (
              <div key={file.id} className="flex items-center justify-between p-2 bg-slate-50 border border-slate-200 rounded text-xs">
                <span className="truncate max-w-[150px]">{file.file.name}</span>
                <span className="text-slate-400">{formatFileSize(file.file.size)}</span>
                <button onClick={() => removeFile(file.id)} className="text-red-400 hover:text-red-600">
                  <X size={14} />
                </button>
              </div>
            ))}
            
            <label className="flex items-center justify-center w-full h-12 px-4 transition bg-white border-2 border-slate-300 border-dashed rounded-md appearance-none cursor-pointer hover:border-blue-400 focus:outline-none">
                <span className="flex items-center space-x-2 text-slate-500">
                    <Upload size={16} />
                    <span className="text-xs font-medium">Upload {title}</span>
                </span>
                <input 
                    type="file" 
                    name={`file_${type}`} 
                    className="hidden" 
                    onChange={(e) => handleFileChange(e, type)} 
                    accept=".pdf,image/*"
                    multiple={type === 'pyq'}
                />
            </label>
        </div>
      </div>
    );
  };

  return (
    <div className="p-4 bg-white border-r border-slate-200 h-full overflow-y-auto w-full md:w-80 flex-shrink-0">
        <div className="mb-8">
            <h1 className="text-xl font-bold font-serif text-slate-800 tracking-tight">ExamStrategy.ai</h1>
            <p className="text-xs text-slate-500 mt-1">Upload your materials to detect patterns.</p>
        </div>

        {renderFileList('syllabus', 'Syllabus', <Layers size={16} className="text-indigo-600"/>)}
        {renderFileList('pyq', 'Previous Year Papers (PYQ)', <FileText size={16} className="text-emerald-600"/>)}
        {renderFileList('book', 'Books/Notes (Optional)', <BookOpen size={16} className="text-orange-600"/>)}
    </div>
  );
};