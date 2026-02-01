// services/cvAIService.ts
// ------------------------------------------------------------------
// Thin client that talks to the FastAPI CV evaluator and normalises
// the response into a structure that the React UI can consume safely.
// ------------------------------------------------------------------

export interface CVEvaluationRequest {
  file: File;
}

// Raw response schema returned by the Python service (all optional).
export interface PythonAIResponse {
  candidate?: {
    name: string | null;
    contacts?: {
      emails?: string[];
      phones?: string[];
      links?: string[];
    };
  };
  sections_detected?: string[];
  education?: string[];
  experiences?: Array<{
    raw: string;
    dates: string | null;
    title: string | null;
    organization: string | null;
  }>;
  // Deployments can return skills either as a grouped object or a flat list.
  skills?:
    | {
        hard?: string[];
        tools?: string[];
        soft?: string[];
      }
    | string[];

  jd?: {
    skills_inferred?: string[];
  };

  matching?: {
    skill_coverage_percent?: number;
    skills_matched?: string[];
    skills_missing?: string[];
  };

  scoring?: {
    tfidf_similarity_percent?: number;
    semantic_similarity_percent?: number;
    overall_score_percent?: number;
    // Some older builds stuff coverage inside the scoring blob.
    skill_coverage_percent?: number;
  };

  analysis?: {
    strengths?: string[];
    improvements?: string[];
    recommendations?: string[];
  };

  suggestions?: string[];

  error?: string;
  message?: string;
}

// Normalised payload consumed by the React UI.
export interface CVAnalysisResult {
  matchScore: number;
  extractedData: {
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
    experiences?: Array<{
      raw: string;
      dates: string | null;
      title: string | null;
      organization: string | null;
    }>;
  };
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  scoring: {
    tfidfSimilarity: number;
    semanticSimilarity: number;
    overallScore: number;
  };
}

export class CVAIService {
  // Must align with the FastAPI router mount (api/v1).
  private readonly baseUrl = 'http://localhost:8000/api/v1';

  async evaluateCV(
    file: File,
    jobDescription?: string,
    signal?: AbortSignal,
  ): Promise<CVAnalysisResult> {
    try {
      const formData = this.buildFormData(file, jobDescription);
      const res = await fetch(`${this.baseUrl}/evaluate-cv`, {
        method: 'POST',
        body: formData,
        signal,
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => '');
        throw new Error(`API call failed (${res.status}). ${errorText}`);
      }

      const raw: PythonAIResponse = await res.json();
      return this.transformAIResponse(raw);
    } catch (err) {
      if (err instanceof Error) {
        if (err.name === 'TypeError' && /fetch/i.test(err.message)) {
          throw new Error('Unable to reach the AI service. Please verify your network connection.');
        }
        if (err.name === 'AbortError') {
          throw new Error('Upload cancelled.');
        }
        throw new Error(err.message || 'An unexpected error occurred while analysing the CV.');
      }
      throw new Error('An unexpected error occurred while analysing the CV.');
    }
  }

  private buildFormData(file: File, jobDescription?: string): FormData {
    const formData = new FormData();
    formData.append('file', file);
    formData.append('jd_text', jobDescription || this.getDefaultJobDescription());
    return formData;
  }

  private getDefaultJobDescription(): string {
    return `
    We are looking for a Python developer with experience in FastAPI, scikit-learn, and NLP.
    The ideal candidate should have skills in data analysis and machine learning.
    Required skills: Python, FastAPI, Machine Learning, NLP, Data Analysis
    `;
  }

  // Convert the raw payload into something the UI layer can consume safely.
  private transformAIResponse(ai: PythonAIResponse): CVAnalysisResult {
    if (ai?.error || ai?.message) {
      throw new Error(ai.message || ai.error || 'AI service returned an error');
    }

    const scoring = ai.scoring || {};
    const overall = roundTo(scoring.overall_score_percent, 0);
    const tfidf = roundTo(scoring.tfidf_similarity_percent, 0);
    const semantic = roundTo(scoring.semantic_similarity_percent, 0);

    const covFromMatching = ai.matching?.skill_coverage_percent;
    const covFromScoring = ai.scoring?.skill_coverage_percent;
    const coverage = roundTo(
      typeof covFromMatching === 'number' ? covFromMatching : covFromScoring,
      1,
    );

    const flatSkills = flattenSkills(ai.skills);
    const candidateName = ai.candidate?.name || undefined;
    const emails = ai.candidate?.contacts?.emails || [];
    const phones = ai.candidate?.contacts?.phones || [];
    const links = ai.candidate?.contacts?.links || [];
    const matchedSkills = ai.matching?.skills_matched || [];
    const missingSkills = ai.matching?.skills_missing || [];
    const sections = ai.sections_detected || [];
    const education = ai.education || [];
    const experiences = ai.experiences || [];

    const analysis = ai.analysis || {};
    const strengths =
      (analysis.strengths && analysis.strengths.length > 0
        ? analysis.strengths
        : this.generateStrengthsFromAI(matchedSkills, overall)) || [];

    const improvements =
      (analysis.improvements && analysis.improvements.length > 0
        ? analysis.improvements
        : ai.suggestions && ai.suggestions.length > 0
        ? ai.suggestions
        : this.generateImprovements(flatSkills, overall)) || [];

    const recommendations =
      (analysis.recommendations && analysis.recommendations.length > 0
        ? analysis.recommendations
        : this.generateRecommendationsFromAI(missingSkills, overall)) || [];

    return {
      matchScore: overall,
      extractedData: {
        emails,
        phones,
        links,
        skills: flatSkills,
        sections,
        coverage,
        matchedSkills,
        missingSkills,
        candidateName,
        education,
        experiences,
      },
      strengths,
      improvements,
      recommendations,
      scoring: {
        tfidfSimilarity: tfidf,
        semanticSimilarity: semantic,
        overallScore: overall,
      },
    };
  }

  private generateStrengthsFromAI(matchedSkills: string[], overall: number): string[] {
    const out: string[] = [];
    if (overall >= 70) out.push('CV content aligns with the role requirements.');
    if (matchedSkills.length > 0) {
      out.push(`Highlights ${matchedSkills.length} matching skills: ${matchedSkills.slice(0, 3).join(', ')}`);
    }
    if (overall >= 80) out.push('Structure is clear and maps well to the job description.');
    if (overall >= 90) out.push('Top-tier profile that fits perfectly for this position.');
    if (out.length === 0) out.push('Solid foundational CV detected.');
    return uniqueStrings(out);
  }

  private generateImprovements(skills: string[], overall: number): string[] {
    const out: string[] = [];
    if (overall < 70) out.push('Improve alignment between the CV and the job description.');
    if (!skills || skills.length < 3) out.push('Add more measurable hard skills.');
    if (overall < 80) out.push('Clarify quantifiable achievements and responsibilities.');
    if (overall < 60) out.push('Rework the structure so recruiters can scan quicker.');
    if (out.length === 0) {
      out.push('Consider adding a personal side project that showcases impact.');
      out.push('Provide any relevant certifications or training.');
    }
    return uniqueStrings(out);
  }

  private generateRecommendationsFromAI(missingSkills: string[], overall: number): string[] {
    const out: string[] = [];
    if (missingSkills?.length) out.push(`Upskill on: ${missingSkills.join(', ')}`);
    if (overall < 70) {
      out.push('Join targeted courses to sharpen domain expertise.');
      out.push('Build production-like projects to enrich the portfolio.');
    }
    if (missingSkills?.some(s => /python/i.test(s))) out.push('Invest time in deepening Python proficiency.');
    if (missingSkills?.some(s => /fastapi/i.test(s))) out.push('Study FastAPI best practices and deployment.');
    out.push('Keep an active GitHub profile with well-documented repositories.');
    out.push('Engage with tech communities and actively network.');
    if (overall >= 80) out.push('Confidently apply to senior or lead positions.');
    return uniqueStrings(out).slice(0, 5);
  }

  async checkHealth(signal?: AbortSignal): Promise<boolean> {
    try {
      const res = await fetch(`${this.baseUrl}/`, {
        method: 'GET',
        signal,
      });
      return res.ok;
    } catch {
      return false;
    }
  }
}

function roundTo(value?: number, digits: number = 0): number {
  if (typeof value !== 'number' || Number.isNaN(value)) return 0;
  const precision = Math.pow(10, digits);
  return Math.round(value * precision) / precision;
}

function uniqueStrings(arr: string[]): string[] {
  return Array.from(new Set(arr.filter(Boolean).map(s => s.trim()).filter(Boolean)));
}

function flattenSkills(skills: PythonAIResponse['skills']): string[] {
  if (!skills) return [];
  if (Array.isArray(skills)) {
    return uniqueStrings(skills.map(String));
  }
  const hard = Array.isArray(skills.hard) ? skills.hard : [];
  const tools = Array.isArray(skills.tools) ? skills.tools : [];
  const soft = Array.isArray(skills.soft) ? skills.soft : [];
  return uniqueStrings([...hard, ...tools, ...soft].map(String));
}

export const cvAIService = new CVAIService();
