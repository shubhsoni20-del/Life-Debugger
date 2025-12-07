export interface LifeDebugReport {
  ai_reaction: string;
  whats_broken: string;
  why_it_matters: string;
  optimized_version: string;
  step_by_step_fix: string[];
  priority_tasks: string[];
  future_prevention_plan: string[];
  follow_up_question: string;
}

export interface ImageFile {
  base64: string;
  mimeType: string;
  previewUrl: string;
}

export type AnalysisVibe = 'roast' | 'constructive' | 'gentle' | 'efficient';

export interface ChatMessage {
  role: 'user' | 'model';
  text: string;
}