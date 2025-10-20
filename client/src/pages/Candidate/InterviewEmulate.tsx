import React, { useState, useEffect, useRef } from 'react';
import {
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
  Stepper,
  Step,
  StepLabel,
  StepContent,
  Card,
  CardContent,
  Avatar,
  Chip,
  LinearProgress,
  Alert,
  Divider,
  CircularProgress,
  List, ListItem, ListItemIcon, ListItemText
} from '@mui/material';
import { useTheme } from '@mui/material/styles';
import { cvAIService, CVAnalysisResult } from '../../services/cvAIService';
import {
  CloudUpload as CloudUploadIcon,
  Psychology as PsychologyIcon,
  Assessment as AssessmentIcon,
  Send as SendIcon,
  AttachFile as AttachFileIcon,
  SmartToy as BotIcon,
  Person as PersonIcon,
  Star as StarIcon,
  Refresh as RefreshIcon,
  TipsAndUpdates as TipsIcon
} from '@mui/icons-material';

interface ChatMessage {
  sender: 'user' | 'ai';
  text: string;
  state?: any;
  timestamp?: Date;
}

// Interface này sẽ được import từ cvAIService.ts

interface InterviewProgress {
  current: number;
  total: number;
}

interface InterviewResult {
  final_score: number;
  breakdown: {
    cv_score: number;
    interview_score: number;
  };
  improvements?: { area: string; tip: string }[];
}

const InterviewEmulate: React.FC = () => {
  const theme = useTheme();
  const [activeStep, setActiveStep] = useState(0);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [cvAnalysis, setCvAnalysis] = useState<CVAnalysisResult | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const [isInterviewActive, setIsInterviewActive] = useState(false);
  const [isFinished, setIsFinished] = useState(false);
  const [interviewProgress, setInterviewProgress] = useState<InterviewProgress>({ current: 0, total: 0 });
  const [interviewResult, setInterviewResult] = useState<InterviewResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isTyping, setIsTyping] = useState(false);
  const [isStartingInterview, setIsStartingInterview] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);
  const chatSectionRef = useRef<HTMLDivElement>(null);
  const [engineState, setEngineState] = useState<any>(null);

  const scrollToElement = (element: HTMLDivElement | null) => {
      if (!element) return;
      const rect = element.getBoundingClientRect();
      const absoluteTop = window.pageYOffset + rect.top;
      const targetY = absoluteTop - (window.innerHeight / 2 - rect.height / 2) - 50;
      window.scrollTo({ top: Math.max(targetY, 0), behavior: 'smooth' });
  }

  // Step 1: Upload CV
  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    if (file.type !== 'application/pdf') {
      setError('Vui lòng chọn file PDF');
      return;
    }

    if (file.size > 10 * 1024 * 1024) {
      setError('File không được vượt quá 10MB');
      return;
    }

    setSelectedFile(file);
    setIsUploading(true);
    setError(null);

    try {
      // Sử dụng cvAIService thống nhất với CVEvaluationPage
      const jobDescription = 'Software Developer position with modern technologies and programming skills';
      const result = await cvAIService.evaluateCV(file, jobDescription);
      
      console.log('CV Analysis Response:', result); // Debug log
      
      setCvAnalysis(result);
      setActiveStep(1);
      setIsUploading(false);
      await startInterview(result);
    } catch (err) {
      console.error('CV Analysis Error:', err);
      setError(err instanceof Error ? err.message : 'Không thể kết nối đến server AI. Vui lòng thử lại sau.');
      setIsUploading(false);
    }
  };

  // Step 2: Start Interview
  const startInterview = async (cv?: CVAnalysisResult) => {
    const cvPayload = cv ?? cvAnalysis;
    if (!cvPayload) return; // vẫn bảo vệ nếu TH thật sự không có

    setIsStartingInterview(true);
    setIsInterviewActive(true);
    setActiveStep(1); // Bước 2
    setError(null);

    try {
      console.log('Starting interview with CV analysis:', cvAnalysis);

      const response = await fetch('http://localhost:8000/api/v1/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Lần đầu: gửi history rỗng + cv_analysis_result; kèm state null
        body: JSON.stringify({
          history: [],
          state: null,
          cv_analysis_result: cvPayload
        }),
      });

      console.log('Interview response status:', response.status);
      console.log('Interview response ok:', response.ok);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Interview API Error:', errorText);
        setError(`Server error: ${response.status} - ${errorText}`);
        setIsInterviewActive(false);
        return;
      }

      const data = await response.json();
      console.log('Interview response data:', data);

      if (data.error) {
        setError(data.error);
        setIsInterviewActive(false);
        return;
      }

      const firstText =
        data?.response ||
        'Xin chào! Mình sẽ bắt đầu phỏng vấn dựa trên CV của bạn. Hãy giới thiệu ngắn gọn về bản thân nhé.';

      const aiMessage: ChatMessage = {
        sender: 'ai',
        text: firstText,
        state: data?.state, // LƯU state kèm trong message AI để tương thích BE hiện tại
        timestamp: new Date()
      };

      setMessages([aiMessage]);
      setEngineState(data?.state ?? null); // LƯU state vào engineState để gửi cho lượt sau
      setInterviewProgress(data?.progress || { current: 1, total: 5 });

    } catch (err) {
      console.error('Interview Start Error:', err);
      setError(`Không thể bắt đầu phỏng vấn: ${err instanceof Error ? err.message : 'Unknown error'}`);
      setIsInterviewActive(false);
    } finally {
      setIsStartingInterview(false);
    }
  };

  // Typing animation effect
  const typeMessage = (message: string): Promise<void> => {
    return new Promise((resolve) => {
      let index = 0;
      const interval = setInterval(() => {
        if (index <= message.length) {
          setMessages(prev => {
            const newMessages = [...prev];
            const lastMessage = newMessages[newMessages.length - 1];
            if (lastMessage && lastMessage.sender === 'ai') {
              lastMessage.text = message.substring(0, index);
            }
            return newMessages;
          });
          index++;
        } else {
          clearInterval(interval);
          setIsTyping(false);
          resolve();
        }
      }, 30);
    });
  };

  // Handle Send Message
  const handleSend = async () => {
    const cleanedInput = input.replace(/\s+/g, ' ').trim();
    if (!cleanedInput || isTyping) return;

    if (!engineState) {
      setError('Bạn cần bấm "Bắt đầu phỏng vấn" để nhận câu hỏi đầu tiên.');
      return;
    }

    const userMessage: ChatMessage = {
      sender: 'user',
      text: cleanedInput,
      timestamp: new Date()
    };

    // giữ lịch sử gọn (12 lượt QA ~ 24 msg)
    const newHistory = [...messages, userMessage].slice(-24);
    setMessages(newHistory);
    setInput('');

    try {
      console.log('Sending message with history:', newHistory.length, 'messages');

      const response = await fetch('http://localhost:8000/api/v1/interview', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        // Các lượt sau: gửi history + state; KHÔNG gửi lại cv_analysis_result
        body: JSON.stringify({
          history: newHistory.map(m => ({ sender: m.sender, text: m.text, state: m.state })), // tương thích BE cũ
          state: engineState, // tương thích BE đã sửa (nếu có)
          cv_analysis_result: null
        }),
      });

      console.log('Message response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.error('Interview Message API Error:', errorText);
        setError(`Server error: ${response.status} - ${errorText}`);
        return;
      }

      const data = await response.json();
      console.log('Message response data:', data);

      // cập nhật engineState nếu có
      if (typeof data?.state !== 'undefined') {
        setEngineState(data.state);
      }

      const incoming = (data?.response || '').trim();

      if (data.finished) {
        const finalMessage: ChatMessage = {
          sender: 'ai',
          text: incoming || 'Đã hoàn tất phỏng vấn. Cảm ơn bạn!',
          state: data?.state,
          timestamp: new Date()
        };

        setMessages([...newHistory, finalMessage]);
        setIsFinished(true);
        setActiveStep(2); // -> Bước 3 (Kết quả)
        setInterviewResult({
          final_score: data.final_score,
          breakdown: data.breakdown || {
            cv_score: cvAnalysis?.scoring?.overallScore ?? 0,
            interview_score: 0
          },
          improvements: data.improvements || []
        });
      } else {
        // tránh lặp câu hỏi: so sánh với câu AI gần nhất
        const lastAi = [...newHistory].reverse().find(m => m.sender === 'ai');
        const isDup = lastAi && lastAi.text.trim() === incoming;

        if (!isDup) {
          const aiMessage: ChatMessage = {
            sender: 'ai',
            text: '',
            state: data?.state,
            timestamp: new Date()
          };

          setMessages([...newHistory, aiMessage]);
          setIsTyping(true);
          setInterviewProgress(data?.progress || interviewProgress);
          await typeMessage(incoming);
        } else {
          // nếu lặp, chỉ cập nhật progress/state để không "đẻ" thêm message
          setInterviewProgress(data?.progress || interviewProgress);
        }
      }
    } catch (err) {
      console.error('Interview Error:', err);
      setError(`Có lỗi xảy ra trong quá trình phỏng vấn: ${err instanceof Error ? err.message : 'Unknown error'}`);
    }
  };

  const resetInterview = () => {
    setActiveStep(0);
    setSelectedFile(null);
    setCvAnalysis(null);
    setMessages([]);
    setInput('');
    setIsInterviewActive(false);
    setIsFinished(false);
    setInterviewProgress({ current: 0, total: 0 });
    setInterviewResult(null);
    setError(null);
    setIsStartingInterview(false);
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return theme.palette.success.main;
    if (score >= 60) return theme.palette.warning.main;
    return theme.palette.error.main;
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return 'Xuất sắc';
    if (score >= 60) return 'Tốt';
    return 'Cần cải thiện';
  };

  useEffect(() => {
    if (messages.length > 0 && chatSectionRef.current){
      scrollToElement(chatSectionRef.current);
    }
  }, [messages.length]);

  useEffect(() => {
    if (isInterviewActive && chatSectionRef.current){
      scrollToElement(chatSectionRef.current);
    }
  }, [isInterviewActive]);

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
            Giả lập phỏng vấn AI
          </Typography>
          <Typography 
            variant="h6" 
            color="text.secondary"
            sx={{ mb: 1 }}
          >
            Trải nghiệm phỏng vấn thông minh với AI dựa trên CV của bạn
          </Typography>
          <Typography 
            variant="body1" 
            color="text.secondary"
          >
            Hệ thống sẽ phân tích CV và tạo câu hỏi phỏng vấn phù hợp với profile của bạn
          </Typography>
        </Box>

        {error && (
          <Alert severity="error" sx={{ mb: 3 }}>
            <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
              Lỗi: {error}
            </Typography>
            <Typography variant="caption" color="text.secondary">
              Vui lòng kiểm tra Console (F12) để xem chi tiết lỗi
            </Typography>
          </Alert>
        )}

        <Box sx={{ display: 'flex', gap: 4, flexDirection: { xs: 'column', md: 'row' } }}>
          {/* Main Content */}
          <Box sx={{ flex: { xs: '1', md: '2' }, minWidth: 0 }}>
            <Paper sx={{ p: 4, borderRadius: 3 }}>
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
                      Bước 1: Tải lên CV của bạn
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
                            '&:hover': {
                              backgroundColor: `${theme.palette.primary.main}12`,
                              transform: 'translateY(-2px)',
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
                              cursor: 'pointer'
                            }}
                          />
                          <AttachFileIcon 
                            sx={{ 
                              fontSize: 48, 
                              color: theme.palette.primary.main,
                              mb: 2
                            }} 
                          />
                          <Typography variant="h6" color="primary" fontWeight={600}>
                            Kéo thả CV hoặc click để chọn
                          </Typography>
                          <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                            Chỉ hỗ trợ file PDF, tối đa 10MB
                          </Typography>
                        </Box>
                      ) : (
                        <Card>
                          <CardContent>
                            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                              <Box sx={{ display: 'flex', alignItems: 'center' }}>
                                <AttachFileIcon sx={{ mr: 2, color: theme.palette.primary.main }} />
                                <Box>
                                  <Typography variant="subtitle1" fontWeight={600}>
                                    {selectedFile.name}
                                  </Typography>
                                  <Typography variant="body2" color="text.secondary">
                                    {(selectedFile.size / 1024 / 1024).toFixed(2)} MB
                                  </Typography>
                                </Box>
                              </Box>
                              {isUploading && <CircularProgress size={24} />}
                            </Box>
                            
                            {isUploading && (
                              <Box sx={{ mt: 2 }}>
                                <LinearProgress />
                                <Typography variant="body2" color="text.secondary" sx={{ mt: 1 }}>
                                  Đang phân tích CV bằng AI...
                                </Typography>
                              </Box>
                            )}
                            
                            {cvAnalysis && (
                              <Box sx={{ mt: 2 }}>
                                <Alert severity="success">
                                  CV đã được phân tích thành công! Điểm đánh giá: {cvAnalysis?.scoring?.overallScore || 0}%
                                </Alert>
                                <Box sx={{ display: 'flex', gap: 1, mt: 2 }}>
                                  <Button
                                    variant="outlined"
                                    onClick={async () => {
                                      try {
                                        const isHealthy = await cvAIService.checkHealth();
                                        console.log('Server health check:', isHealthy);
                                        setError(isHealthy ? `Server OK: CV AI Service đang hoạt động` : `Server Error: CV AI Service không khả dụng`);
                                      } catch (err) {
                                        console.error('Server test failed:', err);
                                        setError(`Không thể kết nối server: ${err instanceof Error ? err.message : 'Unknown error'}`);
                                      }
                                    }}
                                    sx={{ flex: 1 }}
                                  >
                                    Test Server
                                  </Button>
                                  <Button
                                    variant="contained"
                                    startIcon={isStartingInterview ? <CircularProgress size={20} /> : <PsychologyIcon />}
                                    onClick={() => startInterview()}
                                    disabled={isStartingInterview}
                                    sx={{ flex: 2 }}
                                  >
                                    {isStartingInterview ? 'Đang khởi tạo...' : 'Bắt đầu phỏng vấn'}
                                  </Button>
                                </Box>
                              </Box>
                            )}
                          </CardContent>
                        </Card>
                      )}
                    </Box>
                  </StepContent>
                </Step>

                {/* Step 2: Interview Chat */}
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
                        <PsychologyIcon sx={{ color: 'white', fontSize: 20 }} />
                      </Box>
                    )}
                  >
                    <Typography variant="h6" fontWeight={600}>
                      Bước 2: Phỏng vấn với AI
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    <Box sx={{ my: 3 }} ref = {chatSectionRef}>
                      {/* Progress */}
                      {interviewProgress.total > 0 && (
                        <Card sx={{ mb: 3, bgcolor: `${theme.palette.primary.main}08` }}>
                          <CardContent>
                            <Typography variant="subtitle2" fontWeight={600} sx={{ mb: 1 }}>
                              Tiến trình phỏng vấn: {interviewProgress.current}/{interviewProgress.total}
                            </Typography>
                            <LinearProgress 
                              variant="determinate" 
                              value={(interviewProgress.current / interviewProgress.total) * 100}
                              sx={{ height: 8, borderRadius: 4 }}
                            />
                          </CardContent>
                        </Card>
                      )}
                      
                      {/* Chat Messages */}
                      <Card sx={{ mb: 2, height: '400px', overflow: 'hidden' }}>
                        <Box sx={{ 
                          height: '100%', 
                          overflowY: 'auto', 
                          p: 2,
                          bgcolor: theme.palette.background.default 
                        }}>
                          {messages.map((msg, index) => (
                            <Box
                              key={index}
                              sx={{
                                display: 'flex',
                                justifyContent: msg.sender === 'user' ? 'flex-end' : 'flex-start',
                                mb: 2
                              }}
                            >
                              <Box
                                sx={{
                                  display: 'flex',
                                  alignItems: 'flex-start',
                                  maxWidth: '80%',
                                  flexDirection: msg.sender === 'user' ? 'row-reverse' : 'row'
                                }}
                              >
                                <Avatar
                                  sx={{
                                    bgcolor: msg.sender === 'user' ? theme.palette.primary.main : theme.palette.secondary.main,
                                    width: 32,
                                    height: 32,
                                    mx: 1
                                  }}
                                >
                                  {msg.sender === 'user' ? <PersonIcon /> : <BotIcon />}
                                </Avatar>
                                <Paper
                                  sx={{
                                    p: 2,
                                    bgcolor: msg.sender === 'user' ? theme.palette.primary.main : 'white',
                                    color: msg.sender === 'user' ? 'white' : 'inherit',
                                    borderRadius: 2
                                  }}
                                >
                                  <Typography variant="body1" sx={{ whiteSpace: 'pre-wrap' }}>
                                    {msg.text}
                                    {msg.sender === 'ai' && isTyping && index === messages.length - 1 && '▊'}
                                  </Typography>
                                </Paper>
                              </Box>
                            </Box>
                          ))}
                          <div ref={messagesEndRef} />
                        </Box>
                      </Card>

                      {/* Input Field */}
                      {(activeStep === 1) && !isFinished && (
                        <Box sx={{ display: 'flex', gap: 1 }}>
                          <TextField
                            fullWidth
                            variant="outlined"
                            placeholder="Nhập câu trả lời của bạn..."
                            value={input}
                            onChange={(e) => setInput(e.target.value)}
                            onKeyDown={(e) =>{
                              if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSend();
                              }
                            }}
                            disabled={isTyping}
                            multiline
                            maxRows={3}
                          />
                          <Button
                            variant="contained"
                            onClick={handleSend}
                            disabled={!input.trim() || isTyping}
                            sx={{ minWidth: '64px', height: '56px' }}
                          >
                            <SendIcon />
                          </Button>
                        </Box>
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
                        <AssessmentIcon sx={{ color: 'white', fontSize: 20 }} />
                      </Box>
                    )}
                  >
                    <Typography variant="h6" fontWeight={600}>
                      Bước 3: Kết quả đánh giá
                    </Typography>
                  </StepLabel>
                  <StepContent>
                    {interviewResult && (
                      <Box sx={{ my: 3 }}>
                        {/* Final Score */}
                        <Card sx={{ 
                          mb: 3, 
                          background: `linear-gradient(135deg, ${getScoreColor(interviewResult.final_score)} 0%, ${theme.palette.primary.dark} 100%)` 
                        }}>
                          <CardContent sx={{ textAlign: 'center', color: 'white' }}>
                            <Typography variant="h2" fontWeight={700}>
                              {interviewResult.final_score}%
                            </Typography>
                            <Typography variant="h6" sx={{ opacity: 0.9 }}>
                              {getScoreLabel(interviewResult.final_score)}
                            </Typography>
                            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                              {[...Array(5)].map((_, index) => (
                                <StarIcon
                                  key={index}
                                  sx={{
                                    color: index < Math.floor(interviewResult.final_score / 20) ? '#FFD700' : 'rgba(255,255,255,0.3)',
                                    fontSize: 28
                                  }}
                                />
                              ))}
                            </Box>
                          </CardContent>
                        </Card>

                        {/* Breakdown */}
                        <Box sx={{ display: 'flex', gap: 2, mb: 3 }}>
                          <Box sx={{ flex: 1 }}>
                            <Card>
                              <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" color="primary" fontWeight={600}>
                                  {interviewResult.breakdown.cv_score}%
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                  Điểm CV
                                </Typography>
                              </CardContent>
                            </Card>
                          </Box>
                          <Box sx={{ flex: 1 }}>
                            <Card>
                              <CardContent sx={{ textAlign: 'center' }}>
                                <Typography variant="h4" color="secondary" fontWeight={600}>
                                  {interviewResult.breakdown.interview_score}%
                                </Typography>
                                <Typography variant="body1" color="text.secondary">
                                  Điểm phỏng vấn
                                </Typography>
                              </CardContent>
                            </Card>
                          </Box>
                        </Box>

                        {/* Improvements */}
                        {interviewResult.improvements && interviewResult.improvements.length > 0 && (
                          <Card sx={{ mb: 3 }}>
                            <CardContent>
                              <Typography variant="h6" fontWeight={600} sx={{ mb: 1 }}>
                                Những điểm cần cải thiện
                              </Typography>
                              <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                                Dưới đây là các mảng còn yếu và gợi ý cách cải thiện cụ thể dựa trên câu trả lời của bạn.
                              </Typography>
                              <List>
                                {interviewResult.improvements.map((imp, idx) => (
                                  <ListItem key={idx} alignItems="flex-start" sx={{ px: 0 }}>
                                    <ListItemIcon sx={{ minWidth: 36 }}>
                                      <TipsIcon />
                                    </ListItemIcon>
                                    <ListItemText
                                      primary={
                                        <Typography variant="subtitle1" fontWeight={600}>
                                          {imp.area}
                                        </Typography>
                                      }
                                      secondary={
                                        <Typography variant="body2" color="text.secondary" sx={{ whiteSpace: 'pre-wrap' }}>
                                          {imp.tip}
                                        </Typography>
                                      }
                                    />
                                  </ListItem>
                                ))}
                              </List>
                            </CardContent>
                          </Card>
                        )}

                        {/* Actions */}
                        <Box sx={{ textAlign: 'center' }}>
                          <Button
                            variant="outlined"
                            startIcon={<RefreshIcon />}
                            onClick={resetInterview}
                            sx={{ mr: 2 }}
                          >
                            Thử lại
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
                💡 Hướng dẫn sử dụng
              </Typography>
              <Box sx={{ mb: 2 }}>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  1. Tải lên file CV định dạng PDF
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  2. Chờ AI phân tích và tạo câu hỏi
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  3. Trả lời các câu hỏi phỏng vấn
                </Typography>
                <Typography variant="body2" color="text.secondary">
                  4. Nhận kết quả đánh giá chi tiết
                </Typography>
              </Box>
              <Divider sx={{ my: 2 }} />
              <Typography variant="body2" color="text.secondary">
                <strong>AI sẽ tạo câu hỏi</strong> dựa trên nội dung CV của bạn để đảm bảo phù hợp với kinh nghiệm và kỹ năng
              </Typography>
            </Paper>

            {cvAnalysis && (
              <Paper sx={{ p: 3, borderRadius: 3 }}>
                <Typography variant="h6" fontWeight={600} sx={{ mb: 2 }}>
                  📊 Thông tin CV
                </Typography>
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" fontWeight={600}>
                    Ứng viên: {cvAnalysis?.extractedData?.candidateName || 'Không xác định'}
                  </Typography>
                  <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                    Điểm CV: {cvAnalysis?.scoring?.overallScore || 0}%
                  </Typography>
                </Box>
                
                <Box sx={{ mb: 2 }}>
                  <Typography variant="body2" fontWeight={600} sx={{ mb: 1 }}>
                    Kỹ năng phù hợp:
                  </Typography>
                  <Box>
                    {(cvAnalysis?.extractedData?.matchedSkills || []).slice(0, 3).map((skill: string, index: number) => (
                      <Chip 
                        key={index} 
                        label={skill} 
                        size="small" 
                        sx={{ m: 0.5, bgcolor: `${theme.palette.success.main}20` }} 
                      />
                    ))}
                  </Box>
                </Box>
              </Paper>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
};

export default InterviewEmulate;