export interface CVExperience {
  raw: string;
  dates: string | null;
  title: string | null;
  organization: string | null;
}

export interface CVExtractedData {
  emails: string[];
  phones: string[];
  links: string[];
  skills: string[];
  sections: string[];
  coverage: number;
  matchedSkills: string[];
  missingSkills: string[];
  candidateName?: string;
  education?: string[];
  experiences?: CVExperience[];
}

export interface CVScoringData {
  tfidfSimilarity: number;
  semanticSimilarity: number;
  overallScore: number;
}

export interface CVEvaluationData {
  matchScore: number | null;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  extractedData?: CVExtractedData;
  scoring?: CVScoringData;
}

export const getEmptyCVEvaluationData = (): CVEvaluationData => ({
  matchScore: null,
  strengths: [],
  improvements: [],
  recommendations: [],
});

export const CV_FILE_RULES = {
  maxSize: 10 * 1024 * 1024, // 10MB
  mimeTypes: ['application/pdf'],
};
