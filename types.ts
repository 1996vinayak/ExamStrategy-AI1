export interface UploadedFile {
  id: string;
  file: File;
  type: 'syllabus' | 'pyq' | 'book';
  base64?: string;
}

export interface TopicWeightage {
  topic: string;
  frequency: number; // Percentage or count
  trend: 'rising' | 'falling' | 'stable';
}

export interface PredictedQuestion {
  question: string;
  topic: string;
  probability: 'High' | 'Medium' | 'Low';
  reasoning: string;
}

export interface QuestionTwist {
  originalConcept: string;
  standardQuestion: string;
  twistedVariation: string;
  explanation: string;
}

export interface HistoricalOccurrence {
  year: string;
  questionSnippet: string;
  solution: string; // Step-by-step solution
  easyTrick: string; // Mental shortcut or trick
}

export interface DeepDiveConcept {
  conceptName: string;
  occurrences: HistoricalOccurrence[];
  examinerPsychology: string; // Analysis of why this is asked
  currentYearPrediction: string;
  probability: 'High' | 'Medium' | 'Low';
}

export interface SampleQuestion {
  qNo: number;
  text: string;
  marks: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  topic: string;
}

export interface AnalysisResult {
  overview: string;
  weightage: TopicWeightage[];
  predictions: PredictedQuestion[];
  twists: QuestionTwist[];
  deepDive: DeepDiveConcept[];
  samplePaper: SampleQuestion[]; // New sample paper field
  strategy: string;
}

export enum AnalysisStatus {
  IDLE = 'IDLE',
  ANALYZING = 'ANALYZING',
  COMPLETED = 'COMPLETED',
  ERROR = 'ERROR'
}