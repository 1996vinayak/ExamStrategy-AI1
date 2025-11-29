import { GoogleGenAI, Type } from "@google/genai";
import { UploadedFile, AnalysisResult } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

// Helper to clean markdown code blocks from the response
const cleanJsonString = (str: string): string => {
  return str.replace(/```json/g, '').replace(/```/g, '').trim();
};

export const analyzeExamData = async (
  files: UploadedFile[]
): Promise<AnalysisResult> => {
  
  const syllabusFiles = files.filter(f => f.type === 'syllabus');
  const pyqFiles = files.filter(f => f.type === 'pyq');
  const bookFiles = files.filter(f => f.type === 'book');

  if (syllabusFiles.length === 0 || pyqFiles.length === 0) {
    throw new Error("Please upload at least one Syllabus and one Previous Year Question paper.");
  }

  // Prepare parts for the model
  const parts: any[] = [];

  // Add files to parts
  for (const fileObj of files) {
    if (fileObj.base64) {
      parts.push({
        inlineData: {
          mimeType: fileObj.file.type,
          data: fileObj.base64
        }
      });
    }
  }

  // System Prompt for context
  const prompt = `
    You are an expert Indian Exam Strategist and Academic Psychologist. 
    I have provided the following documents:
    1. Syllabus (${syllabusFiles.length} file(s))
    2. Previous Year Question (PYQ) Papers (${pyqFiles.length} file(s))
    ${bookFiles.length > 0 ? `3. Reference Books/Notes (${bookFiles.length} file(s))` : ''}

    Your task is to perform a "Deep Dive Pattern Analysis" to predict this year's exam.
    
    CRITICAL INSTRUCTION: Extract SPECIFIC YEARS (e.g., 2018, 2019) from the papers. If not visible, estimate based on context.
    
    Output a valid JSON object with the following structure:
    
    1. "overview": Summary of exam difficulty trend (Markdown).
    2. "weightage": Array of { "topic", "frequency" (1-100), "trend" ("rising"|"falling"|"stable") }.
    3. "deepDive": Array of detailed concept analyses (Top 5-7 most important concepts).
       - "conceptName": The core topic.
       - "occurrences": Array of { 
            "year": string, 
            "questionSnippet": string, 
            "solution": "Concise step-by-step solution (max 60 words). Focus on key steps.", 
            "easyTrick": "A short mental shortcut or 'jugaad' to solve it fast." 
         }.
       - "examinerPsychology": Why do they ask this? (e.g., "Tests linkage between topics", "Trap for rote learners").
       - "currentYearPrediction": The specific question predicted for THIS year.
       - "probability": "High" | "Medium" | "Low".
    4. "twists": Array of { "originalConcept", "standardQuestion", "twistedVariation", "explanation" }. How they change the question to trick students.
    5. "samplePaper": Generate a predicted question paper for this year based on the patterns. Array of { "qNo": number, "text": string, "marks": number, "difficulty": "Easy"|"Medium"|"Hard", "topic": string }. Generate at least 5-8 questions.
    6. "strategy": Detailed markdown strategy guide.

    Focus on the "Indian Context" (JEE, NEET, UPSC, University Exams).
    Keep the JSON clean and valid. Do not output excessive text that might break the JSON parser.
  `;

  parts.push({ text: prompt });

  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: { parts: parts },
      config: {
        responseMimeType: "application/json",
      }
    });

    if (response.text) {
      const cleanedText = cleanJsonString(response.text);
      try {
        return JSON.parse(cleanedText) as AnalysisResult;
      } catch (parseError) {
        console.error("JSON Parse Error:", parseError);
        console.log("Raw Text:", response.text);
        throw new Error("Failed to parse the analysis results. The model output might be too large or malformed.");
      }
    } else {
      throw new Error("No response generated from the model.");
    }
  } catch (error: any) {
    console.error("Gemini API Error:", error);
    if (error.message.includes("413")) {
      throw new Error("The files are too large. Please try uploading fewer or smaller files.");
    }
    throw new Error("Failed to analyze data. " + error.message);
  }
};