// services/cvAIService.ts
// ----------------------------------------------------
// Service gọi FastAPI để đánh giá CV + chuyển đổi dữ liệu về định dạng FE dùng.
// ----------------------------------------------------

export interface CVEvaluationRequest {
  file: File;
}

// Phản hồi thô từ Python FastAPI (có thể thiếu nhiều trường => đều để optional)
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
  // Có nơi trả về skills dạng object, có nơi trả phẳng -> đều hỗ trợ
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
    // Một số BE cũ lỡ nhét coverage vào scoring -> fallback
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

// Dạng dữ liệu FE dùng trong UI
export interface CVAnalysisResult {
  matchScore: number; // overall score %
  extractedData: {
    emails: string[];
    phones: string[];
    links: string[];
    skills: string[];
    sections: string[];
    coverage: number; // %
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
  // CHÚ Ý: khớp với router mount trong FastAPI (api/v1)
  private baseUrl = 'http://localhost:8000/api/v1';

  async evaluateCV(file: File, jobDescription?: string): Promise<CVAnalysisResult> {
    try {
      // Chuẩn bị form data
      const formData = new FormData();
      formData.append('file', file);

      const jdText =
        jobDescription ||
        `
        We are looking for a Python developer with experience in FastAPI, scikit-learn, and NLP.
        The ideal candidate should have skills in data analysis and machine learning.
        Required skills: Python, FastAPI, Machine Learning, NLP, Data Analysis
      `;
      formData.append('jd_text', jdText);
      console.log(formData)
      const res = await fetch(`http://localhost:8000/api/v1/evaluate-cv`, {
        method: 'POST',
        body: formData,
      });

      if (!res.ok) {
        const errorText = await res.text().catch(() => '');
        throw new Error(`API call failed (${res.status}). ${errorText}`);
      }

      const raw: PythonAIResponse = await res.json();
      return this.transformAIResponse(raw);
    } catch (err) {
      // Network / parse / server errors -> throw message thân thiện
      if (err instanceof Error) {
        // Lỗi fetch network
        if (err.name === 'TypeError' && /fetch/i.test(err.message)) {
          throw new Error('Không thể kết nối đến dịch vụ AI. Vui lòng kiểm tra kết nối mạng.');
        }
        // Lỗi khác
        throw new Error(err.message || 'Có lỗi xảy ra khi phân tích CV. Vui lòng thử lại sau.');
      }
      throw new Error('Có lỗi xảy ra khi phân tích CV. Vui lòng thử lại sau.');
    }
  }

  // Chuyển đổi dữ liệu thô từ BE về dạng FE
  private transformAIResponse(ai: PythonAIResponse): CVAnalysisResult {
    // Nếu BE báo lỗi
    if (ai?.error || ai?.message) {
      throw new Error(ai.message || ai.error || 'AI service returned an error');
    }

    // --- Scoring
    const scoring = ai.scoring || {};
    const overall = roundNum(scoring.overall_score_percent, 0);
    const tfidf = roundNum(scoring.tfidf_similarity_percent, 0);
    const semantic = roundNum(scoring.semantic_similarity_percent, 0);

    // --- Coverage (ưu tiên từ matching; fallback từ scoring nếu BE cũ nhầm chỗ)
    const covFromMatching = ai.matching?.skill_coverage_percent;
    const covFromScoring = ai.scoring?.skill_coverage_percent;
    const coverage = roundNum(
      typeof covFromMatching === 'number' ? covFromMatching : covFromScoring,
      1
    );

    // --- Skills (có thể là object {hard,tools,soft} hoặc mảng phẳng)
    const flatSkills = flattenSkills(ai.skills);

    // --- Candidate & contacts
    const candidateName = ai.candidate?.name || undefined;
    const emails = ai.candidate?.contacts?.emails || [];
    const phones = ai.candidate?.contacts?.phones || [];
    const links = ai.candidate?.contacts?.links || [];

    // --- Matching
    const matchedSkills = ai.matching?.skills_matched || [];
    const missingSkills = ai.matching?.skills_missing || [];

    // --- Sections / education / experiences
    const sections = ai.sections_detected || [];
    const education = ai.education || [];
    const experiences = ai.experiences || [];

    // --- Phân tích/đề xuất
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

  // Suy luận điểm mạnh khi BE không trả analysis
  private generateStrengthsFromAI(matchedSkills: string[], overall: number): string[] {
    const out: string[] = [];
    if (overall >= 70) out.push('Nội dung CV phù hợp với yêu cầu công việc');
    if (matchedSkills.length > 0) out.push(`Có ${matchedSkills.length} kỹ năng phù hợp: ${matchedSkills.slice(0, 3).join(', ')}`);
    if (overall >= 80) out.push('CV có cấu trúc tốt và điểm tương đồng cao');
    if (overall >= 90) out.push('Ứng viên xuất sắc, rất phù hợp với vị trí');
    if (out.length === 0) out.push('CV có định dạng cơ bản phù hợp');
    return uniq(out);
  }

  // Suy luận điểm cần cải thiện khi BE không trả analysis/suggestions
  private generateImprovements(skills: string[], overall: number): string[] {
    const out: string[] = [];
    if (overall < 70) out.push('Cần cải thiện mức độ phù hợp với mô tả công việc');
    if (!skills || skills.length < 3) out.push('Nên bổ sung thêm kỹ năng chuyên môn');
    if (overall < 80) out.push('Cần làm rõ hơn kinh nghiệm và thành tích');
    if (overall < 60) out.push('Cần tái cấu trúc CV để dễ đọc hơn');
    if (out.length === 0) {
      out.push('Có thể bổ sung thêm dự án cá nhân');
      out.push('Nên thêm chứng chỉ chuyên ngành nếu có');
    }
    return uniq(out);
  }

  // Gợi ý hướng phát triển
  private generateRecommendationsFromAI(missingSkills: string[], overall: number): string[] {
    const out: string[] = [];
    if (missingSkills?.length) out.push(`Cần bổ sung kỹ năng: ${missingSkills.join(', ')}`);
    if (overall < 70) {
      out.push('Tham gia khóa học để nâng cao kỹ năng chuyên môn');
      out.push('Làm thêm dự án thực tế để bổ sung portfolio');
    }
    if (missingSkills?.some(s => /python/i.test(s))) out.push('Học Python và các thư viện liên quan');
    if (missingSkills?.some(s => /fastapi/i.test(s))) out.push('Tìm hiểu về FastAPI và phát triển web');
    out.push('Xây dựng profile trên GitHub với các dự án mã nguồn mở');
    out.push('Tham gia cộng đồng công nghệ và networking');
    if (overall >= 80) out.push('Ứng tuyển vào các vị trí senior hoặc lead');
    return uniq(out).slice(0, 5);
  }

  // Health check
  async checkHealth(): Promise<boolean> {
    try {
      // Dùng AbortController để timeout cross-browser
      const controller = new AbortController();
      const timeout = setTimeout(() => controller.abort(), 5000);

      const res = await fetch(`${this.baseUrl}/`, {
        method: 'GET',
        signal: controller.signal,
      });
      clearTimeout(timeout);

      if (!res.ok) return false;

      // Có thể trả JSON { message: "OK" } hoặc tương tự
      // Không bắt buộc parse, chỉ cần 200 là OK
      return true;
    } catch {
      return false;
    }
  }
}

function roundNum(v?: number, digits: number = 0): number {
  if (typeof v !== 'number' || Number.isNaN(v)) return 0;
  const p = Math.pow(10, digits);
  return Math.round(v * p) / p;
}

function uniq(arr: string[]): string[] {
  return Array.from(new Set(arr.filter(Boolean).map(s => s.trim()).filter(Boolean)));
}

function flattenSkills(skills: PythonAIResponse['skills']): string[] {
  if (!skills) return [];
  // Nếu BE trả mảng phẳng
  if (Array.isArray(skills)) {
    return uniq(skills.map(String));
  }
  // Nếu BE trả object
  const hard = Array.isArray(skills.hard) ? skills.hard : [];
  const tools = Array.isArray(skills.tools) ? skills.tools : [];
  const soft = Array.isArray(skills.soft) ? skills.soft : [];
  return uniq([...hard, ...tools, ...soft].map(String));
}

export const cvAIService = new CVAIService();
