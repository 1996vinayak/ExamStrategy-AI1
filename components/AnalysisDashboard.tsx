import React, { useState, useMemo } from 'react';
import { AnalysisResult, HistoricalOccurrence } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Brain, Target, Calendar, ChevronLeft, ChevronRight, Lightbulb, CheckCircle, FileText, X, Zap, BookOpen, Play, Eye, EyeOff } from 'lucide-react';

interface AnalysisDashboardProps {
  data: AnalysisResult;
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#8b5cf6'];

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  
  // Study Mode State
  const [isStudyMode, setIsStudyMode] = useState(false);
  const [studyIndex, setStudyIndex] = useState(0);
  const [showAnswer, setShowAnswer] = useState(false);

  // Flatten all historical questions for the study queue
  const studyQueue = useMemo(() => {
    if (!data.deepDive) return [];
    return data.deepDive.flatMap(concept => 
      concept.occurrences.map(occ => ({
        ...occ,
        conceptName: concept.conceptName,
        psychology: concept.examinerPsychology
      }))
    );
  }, [data.deepDive]);

  const itemsPerPage = 3;
  const totalPages = Math.ceil((data.deepDive?.length || 0) / itemsPerPage);
  
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const startStudySession = (startIndex: number = 0) => {
    setStudyIndex(startIndex);
    setIsStudyMode(true);
    setShowAnswer(false);
  };

  const nextQuestion = () => {
    if (studyIndex < studyQueue.length - 1) {
      setStudyIndex(prev => prev + 1);
      setShowAnswer(false);
    }
  };

  const prevQuestion = () => {
    if (studyIndex > 0) {
      setStudyIndex(prev => prev - 1);
      setShowAnswer(false);
    }
  };

  const currentConcepts = data.deepDive ? data.deepDive.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) : [];

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-16 pb-24 relative">
      
      {/* Study Mode Overlay (Fullscreen) */}
      {isStudyMode && studyQueue.length > 0 && (
        <div className="fixed inset-0 z-50 bg-slate-50 flex flex-col animate-in fade-in duration-200">
            {/* Header */}
            <div className="bg-white border-b border-slate-200 px-6 py-4 flex justify-between items-center shadow-sm">
                <div className="flex items-center gap-4">
                    <div className="w-10 h-10 rounded-full bg-indigo-100 flex items-center justify-center text-indigo-600 font-bold">
                        {studyIndex + 1}
                    </div>
                    <div>
                        <h3 className="text-sm font-bold text-slate-500 uppercase tracking-wider">Smart Study Mode</h3>
                        <p className="text-slate-900 font-medium">Question {studyIndex + 1} of {studyQueue.length}</p>
                    </div>
                </div>
                <div className="flex items-center gap-4">
                     <div className="hidden md:flex flex-col items-end mr-4">
                        <span className="text-xs text-slate-400 font-medium">Progress</span>
                        <div className="w-32 h-2 bg-slate-100 rounded-full mt-1 overflow-hidden">
                            <div 
                                className="h-full bg-indigo-500 transition-all duration-300"
                                style={{ width: `${((studyIndex + 1) / studyQueue.length) * 100}%` }}
                            ></div>
                        </div>
                     </div>
                    <button onClick={() => setIsStudyMode(false)} className="p-2 hover:bg-slate-100 rounded-full text-slate-500 transition">
                        <X size={24} />
                    </button>
                </div>
            </div>

            {/* Main Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-12 max-w-4xl mx-auto w-full flex flex-col gap-8">
                
                {/* Question Card */}
                <div className="space-y-4">
                    <div className="flex items-center gap-3 mb-2">
                        <span className="px-3 py-1 bg-indigo-100 text-indigo-700 rounded-full text-xs font-bold uppercase">
                            {studyQueue[studyIndex].year}
                        </span>
                        <span className="text-sm font-bold text-slate-400 uppercase tracking-wider">
                             {studyQueue[studyIndex].conceptName}
                        </span>
                    </div>
                    <h2 className="text-2xl md:text-3xl font-serif font-medium text-slate-900 leading-tight">
                        "{studyQueue[studyIndex].questionSnippet}"
                    </h2>
                    
                    {/* Psychology Hint */}
                    <div className="inline-flex items-center gap-2 text-amber-600 bg-amber-50 px-3 py-1.5 rounded-lg text-sm border border-amber-100">
                        <Brain size={14} />
                        <span>Examiner's Intent: {studyQueue[studyIndex].psychology}</span>
                    </div>
                </div>

                {/* Solution Area */}
                <div className={`transition-all duration-500 ease-in-out transform ${showAnswer ? 'opacity-100 translate-y-0' : 'opacity-50 translate-y-4 blur-sm grayscale'}`}>
                    <div className="bg-white border border-slate-200 rounded-2xl shadow-sm overflow-hidden">
                        <div className="bg-slate-50 px-6 py-3 border-b border-slate-200 flex justify-between items-center">
                            <span className="font-bold text-slate-700 flex items-center gap-2">
                                <FileText size={18} className="text-emerald-500"/> Standard Solution
                            </span>
                            {!showAnswer && <span className="text-xs text-slate-400 uppercase font-bold">Hidden</span>}
                        </div>
                        <div className="p-6 text-slate-700 text-lg leading-relaxed whitespace-pre-wrap">
                            {studyQueue[studyIndex].solution}
                        </div>
                        
                        {/* Easy Trick Section */}
                        {studyQueue[studyIndex].easyTrick && (
                            <div className="bg-indigo-600 p-6 text-white">
                                <h4 className="flex items-center gap-2 font-bold mb-2 text-indigo-100">
                                    <Zap size={18} className="text-yellow-400 fill-current" />
                                    Smart Trick / Shortcut
                                </h4>
                                <p className="text-indigo-50 italic">
                                    {studyQueue[studyIndex].easyTrick}
                                </p>
                            </div>
                        )}
                    </div>
                </div>

                {/* Reveal Button (only visible if answer hidden) */}
                {!showAnswer && (
                    <div className="flex justify-center py-8">
                        <button 
                            onClick={() => setShowAnswer(true)}
                            className="group flex items-center gap-3 px-8 py-4 bg-slate-900 text-white rounded-full font-bold shadow-lg hover:bg-indigo-600 hover:scale-105 transition-all"
                        >
                            <Eye size={20} className="group-hover:animate-pulse" />
                            Reveal Solution
                        </button>
                    </div>
                )}
            </div>

            {/* Footer Navigation */}
            <div className="bg-white border-t border-slate-200 px-6 py-4 flex justify-between items-center">
                <button 
                    onClick={prevQuestion} 
                    disabled={studyIndex === 0}
                    className="flex items-center gap-2 text-slate-600 hover:text-indigo-600 disabled:opacity-30 font-medium px-4 py-2 hover:bg-slate-50 rounded-lg transition"
                >
                    <ChevronLeft size={20} /> Previous
                </button>
                
                <span className="text-sm text-slate-400 hidden md:inline-block">
                    Tip: Use arrows to navigate
                </span>

                <button 
                    onClick={nextQuestion}
                    disabled={studyIndex === studyQueue.length - 1}
                    className="flex items-center gap-2 bg-indigo-600 text-white px-6 py-2.5 rounded-lg font-medium hover:bg-indigo-700 shadow-sm hover:shadow-indigo-200 transition disabled:opacity-50 disabled:shadow-none"
                >
                    Next Question <ChevronRight size={20} />
                </button>
            </div>
        </div>
      )}

      {/* Executive Summary */}
      <section>
        <h2 className="text-3xl font-serif font-bold text-slate-900 mb-6 border-b border-slate-200 pb-4">Analysis Report</h2>
        <div className="bg-white p-8 rounded-xl shadow-sm border border-slate-100 prose prose-slate max-w-none">
            <React.Fragment>
              {data.overview.split('\n').map((line, i) => (
                  <p key={i} className="mb-2 text-slate-700 leading-relaxed text-lg">{line}</p>
              ))}
            </React.Fragment>
        </div>
      </section>

      {/* Deep Dive Section with Pagination */}
      <section className="scroll-mt-20" id="deep-dive">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-4">
            <div>
                <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
                    <Brain className="text-indigo-600" />
                    Deep Concept Analysis
                </h2>
                <p className="text-slate-500 mt-1 max-w-xl">
                    Explore high-yield topics. Launch the <span className="font-bold text-slate-700">Study Mode</span> to practice questions one-by-one with hidden answers.
                </p>
            </div>
            
            <div className="flex items-center gap-3">
                <button 
                    onClick={() => startStudySession(0)}
                    className="flex items-center gap-2 bg-slate-900 text-white px-4 py-2 rounded-lg font-medium shadow hover:bg-indigo-600 transition"
                >
                    <Play size={16} fill="currentColor" /> Start Study Mode
                </button>

                {totalPages > 1 && (
                    <div className="flex items-center gap-1 bg-white rounded-lg border border-slate-200 p-1 shadow-sm ml-2">
                        <button 
                            onClick={() => handlePageChange(currentPage - 1)}
                            disabled={currentPage === 1}
                            className="p-2 hover:bg-slate-50 disabled:opacity-30 rounded transition"
                        >
                            <ChevronLeft size={20} />
                        </button>
                        <span className="text-sm font-medium px-2 text-slate-600 min-w-[80px] text-center">
                            Page {currentPage} / {totalPages}
                        </span>
                        <button 
                            onClick={() => handlePageChange(currentPage + 1)}
                            disabled={currentPage === totalPages}
                            className="p-2 hover:bg-slate-50 disabled:opacity-30 rounded transition"
                        >
                            <ChevronRight size={20} />
                        </button>
                    </div>
                )}
            </div>
        </div>

        <div className="space-y-8">
            {currentConcepts.map((concept, idx) => (
                <div key={idx} className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
                    {/* Concept Header */}
                    <div className="bg-slate-50 px-6 py-4 border-b border-slate-200 flex justify-between items-center flex-wrap gap-2">
                        <h3 className="font-bold text-xl text-slate-800 font-serif">{concept.conceptName}</h3>
                        <span className={`px-3 py-1 rounded-full text-xs font-bold tracking-wide uppercase ${
                            concept.probability === 'High' ? 'bg-red-100 text-red-700' :
                            concept.probability === 'Medium' ? 'bg-amber-100 text-amber-700' :
                            'bg-green-100 text-green-700'
                        }`}>
                            {concept.probability} Probability
                        </span>
                    </div>

                    <div className="grid grid-cols-1 lg:grid-cols-12 gap-0">
                        {/* History Column */}
                        <div className="lg:col-span-5 p-6 border-b lg:border-b-0 lg:border-r border-slate-100 bg-slate-50/50">
                            <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-6 flex items-center gap-2">
                                <Calendar size={14} className="text-indigo-500"/> Historical Timeline
                            </h4>
                            <div className="space-y-6 relative ml-2 before:absolute before:left-[7px] before:top-2 before:bottom-2 before:w-[2px] before:bg-slate-200">
                                {concept.occurrences.map((occ, i) => (
                                    <div key={i} className="relative pl-8 group">
                                        <div className="absolute left-0 top-1.5 w-4 h-4 rounded-full border-2 border-white bg-indigo-500 shadow-sm z-10 ring-2 ring-indigo-50 group-hover:bg-indigo-600 transition-colors"></div>
                                        <button 
                                            // Find the global index of this occurrence for study mode
                                            onClick={() => {
                                                const globalIndex = studyQueue.findIndex(q => q.questionSnippet === occ.questionSnippet);
                                                if (globalIndex !== -1) startStudySession(globalIndex);
                                            }}
                                            className="w-full text-left bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group-hover:-translate-y-0.5"
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 inline-block px-2 py-0.5 rounded">{occ.year}</span>
                                                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1 group-hover:text-indigo-600">
                                                    Practice <Play size={8} fill="currentColor" />
                                                </span>
                                            </div>
                                            <p className="text-sm text-slate-700 leading-snug line-clamp-2 group-hover:text-indigo-900">"{occ.questionSnippet}"</p>
                                        </button>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Psychology & Prediction Column */}
                        <div className="lg:col-span-7 p-6 bg-white flex flex-col gap-6">
                            
                            {/* Psychology Box */}
                            <div>
                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Brain size={14} className="text-amber-500"/> Examiner's Psychology
                                </h4>
                                <div className="p-5 bg-gradient-to-br from-amber-50 to-orange-50/30 rounded-xl border border-amber-100 text-amber-900 text-sm leading-relaxed relative">
                                    <span className="absolute top-4 left-4 text-4xl text-amber-200 opacity-50 font-serif">"</span>
                                    <p className="relative z-10 italic pl-4">{concept.examinerPsychology}</p>
                                </div>
                            </div>
                            
                            {/* Prediction Box */}
                            <div className="flex-1 flex flex-col">
                                <h4 className="text-xs font-semibold text-slate-500 uppercase tracking-wider mb-3 flex items-center gap-2">
                                    <Target size={14} className="text-emerald-500"/> Predicted Question for This Year
                                </h4>
                                <div className="p-6 bg-gradient-to-br from-indigo-50 to-blue-50/30 rounded-xl border border-indigo-100 shadow-sm flex-1">
                                    <div className="flex items-start gap-3">
                                        <div className="mt-1 min-w-[24px]">
                                            <div className="w-6 h-6 rounded-full bg-indigo-600 text-white flex items-center justify-center text-xs font-bold">Q</div>
                                        </div>
                                        <div>
                                            <p className="font-semibold text-slate-900 text-lg mb-2">
                                                {concept.currentYearPrediction}
                                            </p>
                                            <p className="text-xs text-indigo-600 font-medium">
                                                Confidence: {concept.probability}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
      </section>

      {/* Predicted Sample Paper */}
      {data.samplePaper && data.samplePaper.length > 0 && (
          <section className="bg-white rounded-xl shadow-lg border border-slate-200 overflow-hidden">
              <div className="bg-slate-800 text-white px-8 py-6 flex justify-between items-center">
                  <div>
                      <h2 className="text-2xl font-serif font-bold flex items-center gap-3">
                          <FileText className="text-emerald-400" />
                          Predicted Sample Paper (2025)
                      </h2>
                      <p className="text-slate-300 text-sm mt-1">Based on syllabus weightage and examiner psychology.</p>
                  </div>
                  <div className="hidden md:block text-right">
                      <div className="text-xs font-bold uppercase tracking-widest text-slate-400">Max Marks</div>
                      <div className="text-2xl font-bold">{data.samplePaper.reduce((acc, q) => acc + q.marks, 0)}</div>
                  </div>
              </div>
              
              <div className="p-8">
                  <div className="space-y-6">
                      {data.samplePaper.map((q, idx) => (
                          <div key={idx} className="flex gap-4 p-4 border-b border-slate-100 last:border-0 hover:bg-slate-50 rounded-lg transition">
                              <div className="font-bold text-slate-400 text-lg w-8 pt-1">Q{q.qNo}</div>
                              <div className="flex-1">
                                  <p className="text-slate-800 font-medium text-lg mb-2">{q.text}</p>
                                  <div className="flex gap-3 text-xs">
                                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded border border-slate-200 font-semibold">{q.topic}</span>
                                      <span className={`px-2 py-1 rounded border font-semibold ${
                                          q.difficulty === 'Easy' ? 'bg-green-50 text-green-700 border-green-200' :
                                          q.difficulty === 'Medium' ? 'bg-amber-50 text-amber-700 border-amber-200' :
                                          'bg-red-50 text-red-700 border-red-200'
                                      }`}>{q.difficulty}</span>
                                  </div>
                              </div>
                              <div className="font-serif font-bold text-slate-900 text-lg w-12 text-right">[{q.marks}]</div>
                          </div>
                      ))}
                  </div>
              </div>
          </section>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
        {/* Weightage Chart */}
        <section>
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6 flex items-center gap-2">
                <TrendingUp className="text-indigo-600" />
                Topic Weightage
            </h2>
            <div className="bg-white p-6 rounded-xl shadow-sm border border-slate-100 h-[400px]">
                <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={data.weightage} layout="vertical" margin={{ top: 5, right: 30, left: 60, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} stroke="#e2e8f0" />
                        <XAxis type="number" domain={[0, 100]} hide />
                        <YAxis dataKey="topic" type="category" width={140} tick={{fontSize: 11, fill: '#64748b'}} />
                        <Tooltip 
                            contentStyle={{ backgroundColor: '#fff', borderRadius: '8px', border: '1px solid #e2e8f0', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                            cursor={{fill: '#f8fafc'}}
                        />
                        <Bar dataKey="frequency" radius={[0, 4, 4, 0]} barSize={24}>
                            {data.weightage.map((entry, index) => (
                                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                            ))}
                        </Bar>
                    </BarChart>
                </ResponsiveContainer>
            </div>
        </section>

        {/* Question Twists */}
        <section>
            <h2 className="text-2xl font-serif font-bold text-slate-900 mb-6 flex items-center gap-2">
                <Lightbulb className="text-yellow-600" />
                Pattern Twists
            </h2>
            <div className="space-y-4 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
                {data.twists.map((twist, idx) => (
                    <div key={idx} className="bg-white p-5 rounded-xl border border-slate-200 text-sm shadow-sm transition hover:shadow-md">
                        <div className="font-bold text-slate-800 mb-3 border-b border-slate-100 pb-2">{twist.originalConcept}</div>
                        <div className="space-y-3">
                            <div className="text-slate-600 bg-slate-50 p-3 rounded">
                                <span className="font-semibold text-xs uppercase text-slate-400 block mb-1">Standard Question</span> 
                                {twist.standardQuestion}
                            </div>
                            <div className="text-indigo-800 bg-indigo-50 p-3 rounded border border-indigo-100">
                                <span className="font-semibold text-xs uppercase text-indigo-400 block mb-1">Expected Twist</span> 
                                {twist.twistedVariation}
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
      </div>

      {/* Strategy Section */}
      <section className="bg-slate-900 text-slate-200 p-8 md:p-10 rounded-2xl shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-slate-800 rounded-full mix-blend-multiply filter blur-3xl opacity-50 -translate-y-1/2 translate-x-1/2"></div>
        <h2 className="text-2xl font-serif font-bold text-white mb-6 flex items-center gap-2 relative z-10">
            <CheckCircle className="text-emerald-400" />
            Master Strategy
        </h2>
        <div className="prose prose-invert max-w-none relative z-10">
             <React.Fragment>
                {data.strategy.split('\n').map((line, i) => (
                    <p key={i} className="mb-2 leading-relaxed opacity-90 text-lg font-light">{line}</p>
                ))}
            </React.Fragment>
        </div>
      </section>

    </div>
  );
};