import { useCallback, useEffect, useMemo, useReducer, useRef } from 'react';
import { cvAIService, CVAnalysisResult } from '../services/cvAIService';
import { CVEvaluationData, CV_FILE_RULES, getEmptyCVEvaluationData } from '../types/cvEvaluation';

const DEFAULT_JOB_DESCRIPTION = `
We are hiring a full-stack engineer who can collaborate closely with AI services.
Core skills: Python, JavaScript/TypeScript, React, Node.js/Django/FastAPI, SQL/NoSQL, Docker/Kubernetes, Git, Cloud.
Bonus: Production experience, system thinking, good communication, teamwork mindset.
`;

const MOCK_DELAY = 1200;

interface CVEvaluationState {
  selectedFile: File | null;
  isUploading: boolean;
  cvData: CVEvaluationData;
  error: string | null;
  aiServiceHealth: boolean | null;
}

interface UseCVEvaluationResult extends CVEvaluationState {
  activeStep: number;
  scoreLabel: string;
  handleFileChange: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  resetUpload: () => void;
}

type CVEvaluationAction =
  | { type: 'RESET' }
  | { type: 'UPLOAD_START'; file: File }
  | { type: 'UPLOAD_SUCCESS'; cvData: CVEvaluationData }
  | { type: 'UPLOAD_FAILURE'; error: string; cvData: CVEvaluationData }
  | { type: 'SET_ERROR'; error: string | null }
  | { type: 'SET_HEALTH'; aiServiceHealth: boolean | null };

const initialState: CVEvaluationState = {
  selectedFile: null,
  isUploading: false,
  cvData: getEmptyCVEvaluationData(),
  error: null,
  aiServiceHealth: null,
};

const reducer = (state: CVEvaluationState, action: CVEvaluationAction): CVEvaluationState => {
  switch (action.type) {
    case 'RESET':
      return initialState;
    case 'UPLOAD_START':
      return {
        selectedFile: action.file,
        isUploading: true,
        cvData: getEmptyCVEvaluationData(),
        error: null,
        aiServiceHealth: null,
      };
    case 'UPLOAD_SUCCESS':
      return {
        ...state,
        isUploading: false,
        cvData: action.cvData,
        error: null,
      };
    case 'UPLOAD_FAILURE':
      return {
        ...state,
        isUploading: false,
        cvData: action.cvData,
        error: action.error,
      };
    case 'SET_ERROR':
      return { ...state, error: action.error };
    case 'SET_HEALTH':
      return { ...state, aiServiceHealth: action.aiServiceHealth };
    default:
      return state;
  }
};

export const useCVEvaluation = (
  jobDescription: string = DEFAULT_JOB_DESCRIPTION,
): UseCVEvaluationResult => {
  const [state, dispatch] = useReducer(reducer, initialState);
  const isMounted = useRef(true);
  const abortControllerRef = useRef<AbortController | null>(null);

  useEffect(() => {
    return () => {
      isMounted.current = false;
      abortControllerRef.current?.abort();
    };
  }, []);

  const resetUpload = useCallback(() => {
    abortControllerRef.current?.abort();
    abortControllerRef.current = null;
    dispatch({ type: 'RESET' });
  }, []);

  const normalizeResult = useCallback(
    (result: CVAnalysisResult): CVEvaluationData => ({
      matchScore: result.matchScore ?? null,
      strengths: result.strengths || [],
      improvements: result.improvements || [],
      recommendations: result.recommendations || [],
      extractedData: result.extractedData,
      scoring: result.scoring,
    }),
    [],
  );

  const generateMockEvaluation = useCallback(async (): Promise<CVEvaluationData> => {
    await delay(MOCK_DELAY);
    const mockScore = Math.floor(Math.random() * 40) + 60; // 60 - 99
    return {
      matchScore: mockScore,
      strengths: [
        'Relevant commercial project experience',
        'Solid foundation on modern stacks',
        'Advanced formal education background',
      ],
      improvements: [
        'Add more production references',
        'Highlight measurable achievements',
        'Spend time on communication and soft skills',
      ],
      recommendations: [
        'Join online Machine Learning courses',
        'Polish public portfolio on GitHub',
        'Contribute to community/open-source projects',
      ],
      extractedData: {
        emails: ['candidate@example.com'],
        phones: ['+84 123 456 789'],
        links: ['https://github.com/example'],
        skills: ['Python', 'FastAPI', 'Machine Learning', 'React', 'TypeScript'],
        sections: ['skills', 'experience', 'education', 'projects'],
        coverage: 75,
        matchedSkills: ['Python', 'FastAPI'],
        missingSkills: ['scikit-learn', 'NLP'],
        candidateName: 'Nguyen Van A',
        education: [
          'Bachelor of Computer Science - PTIT University',
          'Certified Python Developer - Coursera',
          'Machine Learning Certificate - Stanford Online',
        ],
        experiences: [
          {
            raw: 'Software Developer at ABC Company (2021-2023)',
            dates: '2021-2023',
            title: 'Software Developer',
            organization: 'ABC Company',
          },
          {
            raw: 'Intern at XYZ Tech (2020-2021)',
            dates: '2020-2021',
            title: 'Intern',
            organization: 'XYZ Tech',
          },
        ],
      },
      scoring: {
        tfidfSimilarity: Math.floor(Math.random() * 20) + 70,
        semanticSimilarity: Math.floor(Math.random() * 20) + 75,
        overallScore: mockScore,
      },
    };
  }, []);

  const validateFile = useCallback((file: File): string | null => {
    if (!CV_FILE_RULES.mimeTypes.includes(file.type)) {
      return 'Only PDF files are supported.';
    }

    if (file.size > CV_FILE_RULES.maxSize) {
      return 'File size must be below 10MB.';
    }

    return null;
  }, []);

  const evaluateFile = useCallback(
    async (file: File) => {
      const controller = new AbortController();
      abortControllerRef.current?.abort();
      abortControllerRef.current = controller;

      dispatch({ type: 'UPLOAD_START', file });

      try {
        const healthy = await cvAIService.checkHealth(controller.signal);
        if (!isMounted.current || controller.signal.aborted) return;

        dispatch({ type: 'SET_HEALTH', aiServiceHealth: healthy });

        const evaluationData = healthy
          ? normalizeResult(await cvAIService.evaluateCV(file, jobDescription, controller.signal))
          : await generateMockEvaluation();

        if (!isMounted.current || controller.signal.aborted) return;

        dispatch({ type: 'UPLOAD_SUCCESS', cvData: evaluationData });
      } catch (apiError) {
        if (!isMounted.current || controller.signal.aborted) return;

        dispatch({ type: 'SET_HEALTH', aiServiceHealth: false });
        const fallbackData = await generateMockEvaluation();
        const fallbackMessage =
          apiError instanceof Error
            ? apiError.message
            : 'Unexpected error occurred during CV analysis.';
        dispatch({ type: 'UPLOAD_FAILURE', error: fallbackMessage, cvData: fallbackData });
      } finally {
        if (abortControllerRef.current === controller) {
          abortControllerRef.current = null;
        }
      }
    },
    [jobDescription, normalizeResult, generateMockEvaluation],
  );

  const handleFileChange = useCallback(
    async (event: React.ChangeEvent<HTMLInputElement>) => {
      const file = event.target.files?.[0];
      if (!file) return;

      const validationError = validateFile(file);
      if (validationError) {
        dispatch({ type: 'SET_ERROR', error: validationError });
        event.target.value = '';
        return;
      }

      dispatch({ type: 'SET_ERROR', error: null });
      await evaluateFile(file);
      event.target.value = '';
    },
    [evaluateFile, validateFile],
  );

  const activeStep = useMemo(() => {
    if (state.isUploading) return 1;
    if (state.cvData.matchScore !== null) return 2;
    return 0;
  }, [state.isUploading, state.cvData.matchScore]);

  const scoreLabel = useMemo(() => {
    if (state.cvData.matchScore === null) return 'No data';
    if (state.cvData.matchScore >= 80) return 'Excellent';
    if (state.cvData.matchScore >= 60) return 'Good';
    return 'Needs improvement';
  }, [state.cvData.matchScore]);

  return {
    ...state,
    activeStep,
    scoreLabel,
    handleFileChange,
    resetUpload,
  };
};

async function delay(ms: number): Promise<void> {
  return new Promise(resolve => setTimeout(resolve, ms));
}
