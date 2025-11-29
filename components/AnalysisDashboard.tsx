import React, { useState } from 'react';
import { AnalysisResult, HistoricalOccurrence } from '../types';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell } from 'recharts';
import { TrendingUp, Brain, Target, Calendar, ChevronLeft, ChevronRight, Lightbulb, CheckCircle, FileText, X, Zap, BookOpen } from 'lucide-react';

interface AnalysisDashboardProps {
  data: AnalysisResult;
}

const COLORS = ['#4f46e5', '#10b981', '#f59e0b', '#ef4444', '#6366f1', '#8b5cf6'];

export const AnalysisDashboard: React.FC<AnalysisDashboardProps> = ({ data }) => {
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSolution, setSelectedSolution] = useState<HistoricalOccurrence | null>(null);
  
  const itemsPerPage = 3;
  const totalPages = Math.ceil((data.deepDive?.length || 0) / itemsPerPage);
  
  const handlePageChange = (newPage: number) => {
    if (newPage >= 1 && newPage <= totalPages) {
      setCurrentPage(newPage);
    }
  };

  const currentConcepts = data.deepDive ? data.deepDive.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  ) : [];

  return (
    <div className="p-6 md:p-10 max-w-6xl mx-auto space-y-16 pb-24 relative">
      
      {/* Solution Modal Overlay */}
      {selectedSolution && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-in fade-in duration-200">
            <div className="bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden animate-in zoom-in-95 duration-200">
                <div className="bg-indigo-600 px-6 py-4 flex justify-between items-center text-white">
                    <h3 className="font-serif font-bold text-lg flex items-center gap-2">
                        <BookOpen size={20} /> Solution Analysis
                    </h3>
                    <button onClick={() => setSelectedSolution(null)} className="hover:bg-white/20 p-1 rounded-full transition">
                        <X size={20} />
                    </button>
                </div>
                <div className="p-6 max-h-[80vh] overflow-y-auto">
                    <div className="mb-6">
                        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">Question ({selectedSolution.year})</span>
                        <p className="text-slate-900 font-medium text-lg mt-2 leading-relaxed">"{selectedSolution.questionSnippet}"</p>
                    </div>
                    
                    <div className="bg-slate-50 p-4 rounded-xl border border-slate-200 mb-6">
                        <span className="text-xs font-bold text-indigo-600 uppercase tracking-wider flex items-center gap-2 mb-2">
                             Step-by-Step Solution
                        </span>
                        <p className="text-slate-700 leading-relaxed whitespace-pre-wrap text-sm">{selectedSolution.solution}</p>
                    </div>

                    <div className="bg-amber-50 p-4 rounded-xl border border-amber-100">
                        <span className="text-xs font-bold text-amber-600 uppercase tracking-wider flex items-center gap-2 mb-2">
                            <Zap size={14} className="fill-current" /> Mental Trick / Shortcut
                        </span>
                        <p className="text-amber-900 text-sm italic">{selectedSolution.easyTrick || "Focus on the core concept definition."}</p>
                    </div>
                </div>
                <div className="bg-slate-50 px-6 py-3 border-t border-slate-200 text-right">
                    <button onClick={() => setSelectedSolution(null)} className="px-4 py-2 bg-slate-200 text-slate-700 rounded-lg hover:bg-slate-300 text-sm font-medium transition">
                        Close Solution
                    </button>
                </div>
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
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-8 gap-4">
            <div>
                <h2 className="text-2xl font-serif font-bold text-slate-900 flex items-center gap-2">
                    <Brain className="text-indigo-600" />
                    Deep Concept Analysis
                </h2>
                <p className="text-slate-500 mt-1">Click on any past question to reveal the solution & smart tricks.</p>
            </div>
            
            {totalPages > 1 && (
                <div className="flex items-center gap-2 bg-white rounded-lg border border-slate-200 p-1 shadow-sm">
                    <button 
                        onClick={() => handlePageChange(currentPage - 1)}
                        disabled={currentPage === 1}
                        className="p-2 hover:bg-slate-50 disabled:opacity-30 rounded transition"
                    >
                        <ChevronLeft size={20} />
                    </button>
                    <span className="text-sm font-medium px-2 text-slate-600">
                        Page {currentPage} of {totalPages}
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
                                            onClick={() => setSelectedSolution(occ)}
                                            className="w-full text-left bg-white p-3 rounded-lg border border-slate-200 shadow-sm hover:shadow-md hover:border-indigo-200 transition-all group-hover:-translate-y-0.5"
                                        >
                                            <div className="flex justify-between items-start mb-1">
                                                <span className="text-xs font-bold text-indigo-600 bg-indigo-50 inline-block px-2 py-0.5 rounded">{occ.year}</span>
                                                <span className="text-[10px] text-slate-400 font-medium flex items-center gap-1">
                                                    View Solution <ChevronRight size={10} />
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