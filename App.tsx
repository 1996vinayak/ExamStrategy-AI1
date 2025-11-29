import React, { useState } from 'react';
import { FileUploadSection } from './components/FileUploadSection';
import { AnalysisDashboard } from './components/AnalysisDashboard';
import { UploadedFile, AnalysisResult, AnalysisStatus } from './types';
import { analyzeExamData } from './services/geminiService';
import { Loader2, Sparkles, AlertCircle } from 'lucide-react';

const App: React.FC = () => {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [status, setStatus] = useState<AnalysisStatus>(AnalysisStatus.IDLE);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  const handleAnalyze = async () => {
    setStatus(AnalysisStatus.ANALYZING);
    setError(null);
    try {
      const analysis = await analyzeExamData(files);
      setResult(analysis);
      setStatus(AnalysisStatus.COMPLETED);
    } catch (err: any) {
      console.error(err);
      setError(err.message || "An unexpected error occurred during analysis.");
      setStatus(AnalysisStatus.ERROR);
    }
  };

  return (
    <div className="flex flex-col md:flex-row h-screen bg-white overflow-hidden">
      
      {/* Sidebar / File Upload Area */}
      <FileUploadSection files={files} setFiles={setFiles} />

      {/* Main Content Area */}
      <main className="flex-1 overflow-y-auto bg-white relative">
        
        {/* Top Bar for Mobile/Actions */}
        <header className="sticky top-0 z-10 bg-white/80 backdrop-blur-md border-b border-slate-100 px-6 py-4 flex justify-between items-center">
            <h2 className="text-lg font-serif text-slate-800 hidden md:block">
                {result ? "Analysis Report" : "Dashboard"}
            </h2>
            
            <div className="flex items-center gap-4">
                {status === AnalysisStatus.ANALYZING && (
                    <span className="flex items-center text-sm text-indigo-600 animate-pulse">
                        <Loader2 className="animate-spin mr-2" size={16} />
                        Deciphering Patterns...
                    </span>
                )}
                
                <button
                    onClick={handleAnalyze}
                    disabled={status === AnalysisStatus.ANALYZING || files.length < 2}
                    className={`flex items-center gap-2 px-6 py-2.5 rounded-full font-medium transition-all shadow-sm ${
                        status === AnalysisStatus.ANALYZING || files.length < 2
                        ? 'bg-slate-100 text-slate-400 cursor-not-allowed'
                        : 'bg-indigo-600 text-white hover:bg-indigo-700 hover:shadow-indigo-200'
                    }`}
                >
                    <Sparkles size={16} />
                    {status === AnalysisStatus.ANALYZING ? 'Processing...' : 'Analyze Pattern'}
                </button>
            </div>
        </header>

        {/* Content Body */}
        <div className="min-h-[calc(100vh-80px)]">
            {status === AnalysisStatus.ERROR && (
                <div className="p-8 flex flex-col items-center justify-center text-center mt-12">
                    <div className="bg-red-50 p-4 rounded-full mb-4">
                        <AlertCircle className="text-red-500" size={32} />
                    </div>
                    <h3 className="text-xl font-bold text-slate-800 mb-2">Analysis Failed</h3>
                    <p className="text-slate-500 max-w-md">{error}</p>
                    <button 
                        onClick={() => setStatus(AnalysisStatus.IDLE)}
                        className="mt-6 text-indigo-600 hover:underline"
                    >
                        Try Again
                    </button>
                </div>
            )}

            {status === AnalysisStatus.IDLE && (
                <div className="flex flex-col items-center justify-center h-full p-8 text-center mt-12 md:mt-0">
                    <div className="w-24 h-24 bg-indigo-50 rounded-full flex items-center justify-center mb-6">
                        <Sparkles className="text-indigo-600" size={40} />
                    </div>
                    <h2 className="text-3xl font-serif font-bold text-slate-900 mb-4">
                        Predict the Unpredictable
                    </h2>
                    <p className="text-slate-500 max-w-lg leading-relaxed mb-8">
                        Upload your <strong>Syllabus</strong> and <strong>Previous Year Question Papers (PYQs)</strong> on the left panel. 
                        Our AI will analyze 10+ years of trends to tell you exactly what might appear in this year's exam.
                    </p>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-3xl w-full text-left">
                        <div className="p-4 border border-slate-100 rounded-lg bg-slate-50 hover:border-indigo-100 transition">
                            <h4 className="font-bold text-slate-800 mb-1">Topic Weightage</h4>
                            <p className="text-xs text-slate-500">Know which chapters carry the most marks historically.</p>
                        </div>
                        <div className="p-4 border border-slate-100 rounded-lg bg-slate-50 hover:border-indigo-100 transition">
                            <h4 className="font-bold text-slate-800 mb-1">Pattern Twists</h4>
                            <p className="text-xs text-slate-500">See how examiners modify standard questions.</p>
                        </div>
                        <div className="p-4 border border-slate-100 rounded-lg bg-slate-50 hover:border-indigo-100 transition">
                            <h4 className="font-bold text-slate-800 mb-1">2025 Predictions</h4>
                            <p className="text-xs text-slate-500">Get a list of high-probability questions for this year.</p>
                        </div>
                    </div>
                </div>
            )}

            {status === AnalysisStatus.COMPLETED && result && (
                <AnalysisDashboard data={result} />
            )}
        </div>
      </main>
    </div>
  );
};

export default App;