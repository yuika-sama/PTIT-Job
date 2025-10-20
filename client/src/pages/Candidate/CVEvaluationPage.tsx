import React, { useState } from 'react';
import {
  Box,
  Container,
  Typography,
  Paper,
  Button,
  LinearProgress,
  Alert,
  Card,
  CardContent,
  Divider,
  Chip,
  IconButton,
  Stepper,
  Step,
  StepLabel,
  StepContent
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { cvAIService, CVAnalysisResult } from '../../services/cvAIService';
import {
  CloudUpload as CloudUploadIcon,
  Assessment as AssessmentIcon,
  CheckCircle as CheckCircleIcon,
  School as SchoolIcon,
  Work as WorkIcon,
  Star as StarIcon,
  Refresh as RefreshIcon,
  Download as DownloadIcon
} from '@mui/icons-material';

interface CVEvaluationData {
  matchScore: number | null;
  strengths: string[];
  improvements: string[];
  recommendations: string[];
  extractedData?: {
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
  scoring?: {
    tfidfSimilarity: number;
    semanticSimilarity: number;
    overallScore: number;
  };
}

const CVEvaluationPage: React.FC = () => {
  const theme = useTheme();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [isUploading, setIsUploading] = useState(false);
  const [cvData, setCvData] = useState<CVEvaluationData>({
    matchScore: null,
    strengths: [],
    improvements: [],
    recommendations: []
  });
  const [activeStep, setActiveStep] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [aiServiceHealth, setAiServiceHealth] = useState<boolean | null>(null);

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (file.type !== 'application/pdf') {
      setError('Vui lòng chọn file PDF');
      return;
    }

    // Validate file size (max 10MB)
    if (file.size > 10 * 1024 * 1024) {
      setError('File không được vượt quá 10MB');
      return;
    }

    setError(null);
    setSelectedFile(file);
    setActiveStep(1);
    setIsUploading(true);

    try {
      // 1) Health check
      const healthy = await cvAIService.checkHealth();
      setAiServiceHealth(healthy);

      // 2) Gọi API thật nếu service OK, ngược lại fallback mock
      if (healthy) {
        const jobDescription = `
          Chúng tôi đang tìm kiếm ứng viên phát triển phần mềm với công nghệ hiện đại.
          Kỹ năng: Python, JavaScript/TypeScript, React, Node/Django/FastAPI, SQL/NoSQL, Docker/K8s, Git, Cloud.
          Ưu tiên: Kinh nghiệm dự án thực tế, tư duy hệ thống, giao tiếp & teamwork.
        `;

        const aiResult: CVAnalysisResult = await cvAIService.evaluateCV(file, jobDescription);

        setCvData({
          matchScore: aiResult.matchScore,
          strengths: aiResult.strengths,
          improvements: aiResult.improvements,
          recommendations: aiResult.recommendations,
          extractedData: aiResult.extractedData,
          scoring: aiResult.scoring
        });
      } else {
        await simulateMockEvaluation();
      }
      setActiveStep(2);
    } catch (apiError: any) {
      console.error('❌ AI service error:', apiError);
      setError(apiError?.message || 'Có lỗi xảy ra khi phân tích CV');

      // fallback demo nếu lỗi lúc parse/gọi
      await simulateMockEvaluation();
      setActiveStep(2);
    } finally {
      setIsUploading(false);
    }
  };

  // Fallback mock evaluation (demo)
  const simulateMockEvaluation = async (): Promise<void> => {
    return new Promise((resolve) => {
      setTimeout(() => {
        const mockScore = Math.floor(Math.random() * 40) + 60; // 60-100
        setCvData({
          matchScore: mockScore,
          strengths: [
            'Kinh nghiệm làm việc phù hợp với vị trí',
            'Kỹ năng công nghệ tốt',
            'Học vấn chuyên môn cao'
          ],
          improvements: [
            'Thiếu chứng chỉ chuyên ngành',
            'Cần bổ sung thêm dự án thực tế',
            'Kỹ năng mềm cần phát triển'
          ],
          recommendations: [
            'Tham gia các khóa học online về AI/ML',
            'Xây dựng portfolio trên GitHub',
            'Tham gia các dự án mã nguồn mở'
          ],
          extractedData: {
            emails: ['example@email.com'],
            phones: ['+84123456789'],
            links: ['github.com/example'],
            skills: ['Python', 'FastAPI', 'Machine Learning', 'React', 'TypeScript'],
            sections: ['skills', 'experience', 'education', 'projects'],
            coverage: 75.5,
            matchedSkills: ['Python', 'FastAPI'],
            missingSkills: ['scikit-learn', 'nlp'],
            candidateName: 'Nguyễn Văn A',
            education: [
              'Bachelor of Computer Science - PTIT University',
              'Certified Python Developer - Coursera',
              'Machine Learning Certificate - Stanford Online'
            ],
            experiences: [
              {
                raw: 'Software Developer at ABC Company (2021-2023)',
                dates: '2021-2023',
                title: 'Software Developer',
                organization: 'ABC Company'
              },
              {
                raw: 'Intern at XYZ Tech (2020-2021)',
                dates: '2020-2021',
                title: 'Intern',
                organization: 'XYZ Tech'
              }
            ]
          },
          scoring: {
            tfidfSimilarity: Math.floor(Math.random() * 20) + 70, // 70-90
            semanticSimilarity: Math.floor(Math.random() * 20) + 75, // 75-95
            overallScore: mockScore
          }
        });
        resolve();
      }, 1200);
    });
  };

  const resetUpload = () => {
    setSelectedFile(null);
    setCvData({
      matchScore: null,
      strengths: [],
      improvements: [],
      recommendations: []
    });
    setActiveStep(0);
    setError(null);
    setAiServiceHealth(null);
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Xuất sắc';
    if (score >= 60) return 'Tốt';
    return 'Cần cải thiện';
  };

  return (
    <Box sx={{
      minHeight: '100vh',
      backgroundColor: theme.palette.background.default,
      py: 4
    }}>
      <Container maxWidth="lg">
        {/* Header */}
        <Box sx={{ mb: 4, textAlign: 'center' }}>
          <Typography
            variant="h3"
            sx={{
              color: theme.palette.primary.main,
              fontWeight: 700,
              mb: 2
            }}
          >
            Đánh giá CV bằng AI
          </Typography>
          <Typography
            variant="h6"
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            Phân tích CV của bạn và nhận đánh giá chi tiết từ hệ thống AI
          </Typography>
          <Typography
            variant="body1"
            color="text.secondary"
          >
            Khám phá điểm mạnh, điểm cần cải thiện và nhận gợi ý phát triển sự nghiệp
          </Typography>
        </Box>

        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' }, maxWidth: '100%' }}>
          {/* Main Content */}
          <Box sx={{ flex: { xs: '1', md: '2' }, minWidth: 0 }}>
            <Paper sx={{ p: { xs: 2, md: 4 }, borderRadius: 3, overflow: 'hidden' }}>
              <Stepper activeStep={activeStep} orientation="vertical">
                {/* Step 1: Upload CV */}
                <Step>
                  <StepLabel
                    StepIconComponent={() => (
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: activeStep >= 0 ? theme.palette.primary.main : theme.palette.grey[300],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <CloudUploadIcon sx={{ color: 'white', fontSize: 20 }} />
                      </Box>
                    )}
                  >
                    <Typography variant="h6" fontWeight={600}>
                      Tải lên CV của bạn
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <Box sx={{ my: 3 }}>
                      {!selectedFile ? (
                        <Box
                          sx={{
                            border: `2px dashed ${theme.palette.primary.main}`,
                            borderRadius: 2,
                            p: 4,
                            textAlign: 'center',
                            backgroundColor: `${theme.palette.primary.main}08`,
                            cursor: 'pointer',
                            transition: 'all 0.3s ease',
                            position: 'relative',
                            overflow: 'hidden',
                            minHeight: '200px',
                            display: 'flex',
                            flexDirection: 'column',
                            alignItems: 'center',
                            justifyContent: 'center',
                            '&:hover': {
                              backgroundColor: `${theme.palette.primary.main}12`,
                              transform: 'translateY(-2px)',
                              boxShadow: `0 4px 12px ${theme.palette.primary.main}20`
                            }
                          }}
                        >
                          <input
                            type="file"
                            accept=".pdf"
                            onChange={handleFileChange}
                            style={{
                              position: 'absolute',
                              top: 0,
                              left: 0,
                              width: '100%',
                              height: '100%',
                              opacity: 0,
                              cursor: 'pointer',
                              zIndex: 1
                            }}
                          />
                          <CloudUploadIcon
                            sx={{
                              fontSize: 48,
                              color: theme.palette.primary.main,
                              mb: 2,
                              zIndex: 0
                            }}
                          />
                          <Typography variant="h6" color="primary" fontWeight={600} sx={{ zIndex: 0 }}>
                            Kéo thả file CV hoặc click để chọn
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1, zIndex: 0 }}>
                            Chỉ hỗ trợ file PDF, tối đa 10MB
                          </Typography>
                        </Box>
                      ) : (
                        <Alert
                          severity="success"
                          sx={{ mb: 2 }}
                          action={
                            <IconButton size="small" onClick={resetUpload}>
                              <RefreshIcon />
                            </IconButton>
                          }
                        >
                          <Typography variant="body2">
                            <strong>{selectedFile.name}</strong> đã được tải lên thành công
                          </Typography>
                        </Alert>
                      )}
                    </Box>
                  </StepContent>
                </Step>

                {/* Step 2: Analysis */}
                <Step>
                  <StepLabel
                    StepIconComponent={() => (
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: activeStep >= 1 ? theme.palette.primary.main : theme.palette.grey[300],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <AssessmentIcon sx={{ color: 'white', fontSize: 20 }} />
                      </Box>
                    )}
                  >
                    <Typography variant="h6" fontWeight={600}>
                      Phân tích và đánh giá
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <Box sx={{ my: 3 }}>
                      {isUploading ? (
                        <Box sx={{ textAlign: 'center' }}>
                          <Typography variant="body1" sx={{ mb: 2 }}>
                            Đang phân tích CV của bạn bằng AI...
                          </Typography>

                          {aiServiceHealth === false && (
                            <Alert severity="warning" sx={{ mb: 2 }}>
                              Dịch vụ AI tạm thời không khả dụng. Sử dụng chế độ demo.
                            </Alert>
                          )}

                          {aiServiceHealth === true && (
                            <Alert severity="info" sx={{ mb: 2 }}>
                              Đang sử dụng AI service để phân tích CV
                            </Alert>
                          )}

                          <LinearProgress
                            sx={{
                              mb: 2,
                              height: 8,
                              borderRadius: 4,
                              '& .MuiLinearProgress-bar': {
                                backgroundColor: theme.palette.primary.main
                              }
                            }}
                          />
                          <Typography variant="body2" color="text.secondary">
                            Quá trình này có thể mất 30-60 giây
                          </Typography>
                        </Box>
                      ) : (
                        <Typography variant="body1" color="text.secondary">
                          Hệ thống đã hoàn tất phân tích CV của bạn
                        </Typography>
                      )}
                    </Box>
                  </StepContent>
                </Step>

                {/* Step 3: Results */}
                <Step>
                  <StepLabel
                    StepIconComponent={() => (
                      <Box sx={{
                        width: 40,
                        height: 40,
                        borderRadius: '50%',
                        backgroundColor: activeStep >= 2 ? theme.palette.primary.main : theme.palette.grey[300],
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center'
                      }}>
                        <CheckCircleIcon sx={{ color: 'white', fontSize: 20 }} />
                      </Box>
                    )}
                  >
                    <Typography variant="h6" fontWeight={600}>
                      Kết quả đánh giá
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    {cvData.matchScore !== null && (
                      <Box sx={{
                        my: 3,
                        maxHeight: '80vh',
                        overflowY: 'auto',
                        pr: 1,
                        '&::-webkit-scrollbar': { width: '8px' },
                        '&::-webkit-scrollbar-track': { background: theme.palette.grey[100], borderRadius: '4px' },
                        '&::-webkit-scrollbar-thumb': { background: theme.palette.primary.main, borderRadius: '4px' },
                        '&::-webkit-scrollbar-thumb:hover': { background: theme.palette.primary.dark }
                      }}>
                        {/* Score Display */}
                        <Card sx={{ mb: 3, background: `linear-gradient(135deg, ${theme.palette.primary.main} 0%, ${theme.palette.primary.dark} 100%)` }}>
                          <CardContent sx={{ textAlign: 'center', color: 'white' }}>
                            <Typography variant="h2" fontWeight={700}>
                              {cvData.matchScore}%
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9 }}>
                              {getScoreLabel(cvData.matchScore)}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                              {[...Array(5)].map((_, index) => (
                                <StarIcon
                                  key={index}
                                  sx={{
                                    color: index < Math.floor((cvData.matchScore || 0) / 20) ? '#FFD700' : 'rgba(255,255,255,0.3)',
                                    fontSize: 28
                                  }}
                                />
                              ))}
                            </Box>
                          </CardContent>
                        </Card>

                        {/* Detailed Analysis */}
                        <Box sx={{ display: 'flex', flexDirection: { xs: 'column', md: 'column' }, gap: 3, mb: 3 }}>
                          {/* Strengths */}
                          <Box sx={{ flex: 1 }}>
                            <Card sx={{ height: '100%', borderTop: `4px solid ${theme.palette.success.main}` }}>
                              <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <CheckCircleIcon sx={{ color: theme.palette.success.main, mr: 1 }} />
                                  <Typography variant="h6" fontWeight={600}>
                                    Điểm mạnh
                                  </Typography>
                                </Box>
                                {cvData.strengths.map((strength, index) => (
                                  <Chip
                                    key={index}
                                    label={strength}
                                    size="small"
                                    sx={{
                                      m: 0.5,
                                      backgroundColor: `${theme.palette.success.main}20`,
                                      color: theme.palette.success.main
                                    }}
                                  />
                                ))}
                              </CardContent>
                            </Card>
                          </Box>

                          {/* Improvements */}
                          <Box sx={{ flex: 1 }}>
                            <Card sx={{ height: '100%', borderTop: `4px solid ${theme.palette.warning.main}` }}>
                              <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <WorkIcon sx={{ color: theme.palette.warning.main, mr: 1 }} />
                                  <Typography variant="h6" fontWeight={600}>
                                    Cần cải thiện
                                  </Typography>
                                </Box>
                                {cvData.improvements.map((improvement, index) => (
                                  <Chip
                                    key={index}
                                    label={improvement}
                                    size="small"
                                    sx={{
                                      m: 0.5,
                                      backgroundColor: `${theme.palette.warning.main}20`,
                                      color: theme.palette.warning.main
                                    }}
                                  />
                                ))}
                              </CardContent>
                            </Card>
                          </Box>

                          {/* Recommendations */}
                          <Box sx={{ flex: 1 }}>
                            <Card sx={{ height: '100%', borderTop: `4px solid ${theme.palette.info.main}` }}>
                              <CardContent>
                                <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                                  <SchoolIcon sx={{ color: theme.palette.info.main, mr: 1 }} />
                                  <Typography variant="h6" fontWeight={600}>
                                    Gợi ý phát triển
                                  </Typography>
                                </Box>
                                {cvData.recommendations.map((recommendation, index) => (
                                  <Chip
                                    key={index}
                                    label={recommendation}
                                    size="small"
                                    sx={{
                                      m: 0.5,
                                      backgroundColor: `${theme.palette.info.main}20`,
                                      color: theme.palette.info.main
                                    }}
                                  />
                                ))}
                              </CardContent>
                            </Card>
                          </Box>
                        </Box>

                        {/* Extracted Data (if available from AI) */}
                        {cvData.extractedData && (
                          <Box sx={{ mb: 3 }}>
                            <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                              Dữ liệu trích xuất từ CV bằng AI
                            </Typography>

                            {/* Candidate Name */}
                            {cvData.extractedData.candidateName && (
                              <Card sx={{ mb: 2, borderLeft: `4px solid ${theme.palette.info.main}` }}>
                                <CardContent>
                                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                                    Tên ứng viên được nhận diện:
                                  </Typography>
                                  <Typography variant="h6" sx={{ color: theme.palette.info.main }}>
                                    {cvData.extractedData.candidateName}
                                  </Typography>
                                </CardContent>
                              </Card>
                            )}

                            {/* Skills Coverage */}
                            {(cvData.extractedData.coverage !== undefined) && (
                              <Card sx={{ mb: 2, borderLeft: `4px solid ${theme.palette.success.main}` }}>
                                <CardContent>
                                  <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
                                    <Typography variant="subtitle2" fontWeight={600}>
                                      Độ phù hợp với JD:
                                    </Typography>
                                    <Typography variant="h6" sx={{ color: theme.palette.success.main }}>
                                      {cvData.extractedData.coverage}%
                                    </Typography>
                                  </Box>
                                  <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                                    {cvData.extractedData.matchedSkills?.map((skill, index) => (
                                      <Chip
                                        key={index}
                                        label={`✓ ${skill}`}
                                        size="small"
                                        sx={{
                                          backgroundColor: `${theme.palette.success.main}15`,
                                          color: theme.palette.success.main
                                        }}
                                      />
                                    ))}
                                    {cvData.extractedData.missingSkills?.map((skill, index) => (
                                      <Chip
                                        key={index}
                                        label={`✗ ${skill}`}
                                        size="small"
                                        sx={{
                                          backgroundColor: `${theme.palette.error.main}15`,
                                          color: theme.palette.error.main
                                        }}
                                      />
                                    ))}
                                  </Box>
                                </CardContent>
                              </Card>
                            )}

                            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                              {/* Skills */}
                              {cvData.extractedData.skills && cvData.extractedData.skills.length > 0 && (
                                <Card sx={{ flex: 1, borderLeft: `4px solid ${theme.palette.primary.main}` }}>
                                  <CardContent>
                                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                                      Kỹ năng được phát hiện ({cvData.extractedData.skills.length}):
                                    </Typography>
                                    <Box>
                                      {cvData.extractedData.skills.map((skill, index) => (
                                        <Chip
                                          key={index}
                                          label={skill}
                                          size="small"
                                          sx={{
                                            m: 0.25,
                                            backgroundColor: `${theme.palette.primary.main}15`,
                                            color: theme.palette.primary.main
                                          }}
                                        />
                                      ))}
                                    </Box>
                                  </CardContent>
                                </Card>
                              )}

                              {/* Contact Info */}
                              <Card sx={{ flex: 1, borderLeft: `4px solid ${theme.palette.info.main}` }}>
                                <CardContent>
                                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                                    Thông tin liên lạc:
                                  </Typography>

                                  {cvData.extractedData.emails && cvData.extractedData.emails.length > 0 && (
                                    <Box sx={{ mb: 1 }}>
                                      <Typography variant="caption" color="text.secondary">Emails:</Typography>
                                      {cvData.extractedData.emails.map((email, index) => (
                                        <Typography key={index} variant="body2" sx={{
                                          fontFamily: 'monospace',
                                          color: theme.palette.info.main,
                                          fontSize: '0.85rem'
                                        }}>
                                          {email}
                                        </Typography>
                                      ))}
                                    </Box>
                                  )}

                                  {cvData.extractedData.phones && cvData.extractedData.phones.length > 0 && (
                                    <Box sx={{ mb: 1 }}>
                                      <Typography variant="caption" color="text.secondary">Phones:</Typography>
                                      {cvData.extractedData.phones.map((phone, index) => (
                                        <Typography key={index} variant="body2" sx={{
                                          fontFamily: 'monospace',
                                          color: theme.palette.info.main,
                                          fontSize: '0.85rem'
                                        }}>
                                          {phone}
                                        </Typography>
                                      ))}
                                    </Box>
                                  )}

                                  {cvData.extractedData.links && cvData.extractedData.links.length > 0 && (
                                    <Box>
                                      <Typography variant="caption" color="text.secondary">Links:</Typography>
                                      {cvData.extractedData.links.map((link, index) => (
                                        <Typography key={index} variant="body2" sx={{
                                          fontFamily: 'monospace',
                                          color: theme.palette.info.main,
                                          fontSize: '0.85rem'
                                        }}>
                                          {link}
                                        </Typography>
                                      ))}
                                    </Box>
                                  )}
                                </CardContent>
                              </Card>
                            </Box>

                            {/* Sections Found */}
                            {cvData.extractedData.sections && cvData.extractedData.sections.length > 0 && (
                              <Card sx={{ mt: 2, borderLeft: `4px solid ${theme.palette.warning.main}` }}>
                                <CardContent>
                                  <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                                    Cấu trúc CV được nhận diện:
                                  </Typography>
                                  <Box>
                                    {cvData.extractedData.sections.map((section, index) => (
                                      <Chip
                                        key={index}
                                        label={section}
                                        size="small"
                                        sx={{
                                          m: 0.25,
                                          backgroundColor: `${theme.palette.warning.main}15`,
                                          color: theme.palette.warning.main
                                        }}
                                      />
                                    ))}
                                  </Box>
                                </CardContent>
                              </Card>
                            )}

                            {/* Education & Experience */}
                            <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', lg: 'row' }, mt: 2 }}>
                              {/* Education */}
                              {cvData.extractedData.education && cvData.extractedData.education.length > 0 && (
                                <Card sx={{ flex: 1, borderLeft: `4px solid ${theme.palette.secondary.main}` }}>
                                  <CardContent>
                                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                                      Học vấn ({cvData.extractedData.education.length}):
                                    </Typography>
                                    <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
                                      {cvData.extractedData.education.map((edu, index) => (
                                        <Box key={index} sx={{
                                          mb: 1.5,
                                          p: 1.5,
                                          border: `1px solid ${theme.palette.grey[200]}`,
                                          borderRadius: 1,
                                          backgroundColor: `${theme.palette.secondary.main}05`
                                        }}>
                                          <Typography
                                            variant="body2"
                                            sx={{
                                              color: theme.palette.secondary.main,
                                              fontSize: '0.9rem',
                                              fontWeight: 500,
                                              lineHeight: 1.4
                                            }}
                                          >
                                            🎓 {edu}
                                          </Typography>
                                        </Box>
                                      ))}
                                    </Box>
                                  </CardContent>
                                </Card>
                              )}

                              {/* Experience */}
                              {cvData.extractedData.experiences && cvData.extractedData.experiences.length > 0 && (
                                <Card sx={{ flex: 1, borderLeft: `4px solid ${theme.palette.success.main}` }}>
                                  <CardContent>
                                    <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                                      Kinh nghiệm ({cvData.extractedData.experiences.length}):
                                    </Typography>
                                    <Box sx={{ maxHeight: '300px', overflowY: 'auto' }}>
                                      {cvData.extractedData.experiences.map((exp, index) => (
                                        <Box key={index} sx={{
                                          mb: 2,
                                          p: 1.5,
                                          border: `1px solid ${theme.palette.grey[200]}`,
                                          borderRadius: 1,
                                          backgroundColor: `${theme.palette.success.main}05`
                                        }}>
                                          {exp.title && exp.organization && (
                                            <Typography
                                              variant="body2"
                                              sx={{
                                                fontWeight: 600,
                                                color: theme.palette.success.main,
                                                fontSize: '0.9rem',
                                                mb: 0.5
                                              }}
                                            >
                                              {exp.title} - {exp.organization}
                                            </Typography>
                                          )}
                                          {exp.dates && (
                                            <Typography variant="caption" color="text.secondary" sx={{ mb: 0.5, display: 'block' }}>
                                              📅 {exp.dates}
                                            </Typography>
                                          )}
                                          {exp.raw && (
                                            <Typography
                                              variant="body2"
                                              color="text.secondary"
                                              sx={{
                                                fontSize: '0.8rem',
                                                fontStyle: 'italic',
                                                lineHeight: 1.4
                                              }}
                                            >
                                              {exp.raw}
                                            </Typography>
                                          )}
                                        </Box>
                                      ))}
                                    </Box>
                                  </CardContent>
                                </Card>
                              )}
                            </Box>
                          </Box>
                        )}

                        {/* AI Analysis Details */}
                        {cvData.extractedData && aiServiceHealth === true && (
                          <Card sx={{ mb: 3, background: 'linear-gradient(135deg, #f5f7fa 0%, #c3cfe2 100%)' }}>
                            <CardContent>
                              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                                🤖 Chi tiết phân tích AI
                              </Typography>
                              <Box sx={{ display: 'flex', gap: 2, flexDirection: { xs: 'column', sm: 'row' } }}>
                                <Box sx={{ flex: 1, textAlign: 'center' }}>
                                  <Typography variant="body2" color="text.secondary">TF-IDF Similarity</Typography>
                                  <Typography variant="h6" color="primary">
                                    {cvData.scoring?.tfidfSimilarity ?? 'N/A'}%
                                  </Typography>
                                </Box>
                                <Box sx={{ flex: 1, textAlign: 'center' }}>
                                  <Typography variant="body2" color="text.secondary">Semantic Similarity</Typography>
                                  <Typography variant="h6" color="primary">
                                    {cvData.scoring?.semanticSimilarity ?? 'N/A'}%
                                  </Typography>
                                </Box>
                                <Box sx={{ flex: 1, textAlign: 'center' }}>
                                  <Typography variant="body2" color="text.secondary">Skills Coverage</Typography>
                                  <Typography variant="h6" color="primary">
                                    {cvData.extractedData?.coverage ?? 'N/A'}%
                                  </Typography>
                                </Box>
                              </Box>
                            </CardContent>
                          </Card>
                        )}

                        {/* Service Status */}
                        <Box sx={{ mb: 3, textAlign: 'center' }}>
                          {aiServiceHealth === false && (
                            <Alert severity="info" sx={{ mb: 2 }}>
                              📊 Kết quả từ chế độ demo (AI service không khả dụng)
                            </Alert>
                          )}
                        </Box>

                        {/* Error Display */}
                        {error && (
                          <Alert severity="error" sx={{ mb: 3 }}>
                            {error}
                          </Alert>
                        )}

                        {/* Action Buttons */}
                        <Box sx={{ mt: 3, textAlign: 'center' }}>
                          <Button
                            variant="contained"
                            startIcon={<DownloadIcon />}
                            sx={{
                              mr: 2,
                              backgroundColor: theme.palette.primary.main,
                              '&:hover': {
                                backgroundColor: theme.palette.primary.dark
                              }
                            }}
                            onClick={() => alert('Tính năng tải báo cáo sẽ được phát triển')}
                          >
                            Tải báo cáo PDF
                          </Button>
                          <Button
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={resetUpload}
                            sx={{
                              borderColor: theme.palette.primary.main,
                              color: theme.palette.primary.main
                            }}
                          >
                            Phân tích CV khác
                          </Button>
                        </Box>
                      </Box>
                    )}
                  </StepContent>
                </Step>
              </Stepper>
            </Paper>
          </Box>

          {/* Sidebar */}
          <Box sx={{ flex: 1, minWidth: { xs: '100%', md: '300px' } }}>
            <Paper sx={{ p: 3, borderRadius: 3, mb: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Hướng dẫn sử dụng
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  1. Tải lên file CV dạng PDF (tối đa 10MB)
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  2. Chờ hệ thống AI phân tích CV của bạn
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  3. Xem kết quả đánh giá và nhận gợi ý cải thiện
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary">
                💡 <strong>Mẹo:</strong> Đảm bảo CV có cấu trúc rõ ràng và thông tin đầy đủ để có kết quả đánh giá chính xác nhất
              </Typography>
            </Paper>

            <Paper sx={{ p: 3, borderRadius: 3 }}>
              <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                Tính năng AI
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <AssessmentIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                <Typography variant="body2">
                  Phân tích điểm mạnh & yếu
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                <SchoolIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                <Typography variant="body2">
                  Gợi ý phát triển kỹ năng
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <StarIcon sx={{ color: theme.palette.primary.main, mr: 1 }} />
                <Typography variant="body2">
                  Đánh giá tổng thể chuyên nghiệp
                </Typography>
              </Box>
            </Paper>
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default CVEvaluationPage;
