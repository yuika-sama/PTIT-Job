import nodemailer from 'nodemailer';
import config from '../config/config.js';

interface EmailOptions {
    to: string;
    subject: string;
    htmlContent: string;
    textContent?: string;
}

class EmailService {
    private transporter: nodemailer.Transporter;

    constructor() {
        // Cấu hình Mailtrap cho development, fallback sang các provider khác
        const isMailtrap = process.env.EMAIL_SERVICE === 'mailtrap';
        
        if (isMailtrap) {
            // Cấu hình Mailtrap
            this.transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST || 'sandbox.smtp.mailtrap.io',
                port: parseInt(process.env.EMAIL_PORT || '2525'),
                secure: false, // Mailtrap không dùng SSL
                auth: {
                    user: process.env.EMAIL_USER, // Mailtrap username
                    pass: process.env.EMAIL_PASS  // Mailtrap password
                }
            });
        } else {
            // Cấu hình cho Gmail và các provider khác
            this.transporter = nodemailer.createTransport({
                host: process.env.EMAIL_HOST || 'smtp.gmail.com',
                port: parseInt(process.env.EMAIL_PORT || '587'),
                secure: process.env.EMAIL_PORT === '465', // true for 465, false for other ports
                auth: {
                    user: process.env.EMAIL_USER,
                    pass: process.env.EMAIL_PASS
                },
                tls: {
                    rejectUnauthorized: false
                }
            });
        }

        // Verify connection configuration
        this.verifyConnection();
    }

    private async verifyConnection(): Promise<void> {
        try {
            await this.transporter.verify();
            const service = process.env.EMAIL_SERVICE || 'default';
            const host = process.env.EMAIL_HOST;
            console.log(`✅ Email service ready: ${service} (${host})`);
            
            if (service === 'mailtrap') {
                console.log('📧 Mailtrap detected - All emails will be captured in your Mailtrap inbox');
                console.log('🔗 Check your emails at: https://mailtrap.io/inboxes');
            }
        } catch (error) {
            console.error('❌ Email service configuration error:', error);
            console.log('📧 Email service will use console logging for development');
            
            if (process.env.EMAIL_SERVICE === 'mailtrap') {
                console.log('💡 Mailtrap setup help: Check MAILTRAP_SETUP.md for detailed instructions');
            }
        }
    }

    async sendEmail(options: EmailOptions): Promise<boolean> {
        try {
            // Kiểm tra xem có cấu hình email không
            if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
                console.log('📧 Email credentials not configured, logging email content:');
                console.log(`To: ${options.to}`);
                console.log(`Subject: ${options.subject}`);
                console.log(`Content: ${options.textContent || 'HTML content provided'}`);
                console.log('💡 For Mailtrap setup, check MAILTRAP_SETUP.md');
                return true; // Return success for development
            }

            const mailOptions = {
                from: {
                    name: 'PTIT Job',
                    address: process.env.EMAIL_USER!
                },
                to: options.to,
                subject: options.subject,
                html: options.htmlContent,
                text: options.textContent || this.stripHtml(options.htmlContent)
            };

            const info = await this.transporter.sendMail(mailOptions);
            console.log(`✅ Email sent successfully to ${options.to}`);
            console.log(`Message ID: ${info.messageId}`);
            
            if (process.env.EMAIL_SERVICE === 'mailtrap') {
                console.log('📬 Check your Mailtrap inbox: https://mailtrap.io/inboxes');
            }
            
            return true;
        } catch (error: any) {
            console.error(`❌ Failed to send email to ${options.to}:`, error.message);
            
            // Trong development, log email content thay vì fail
            if (process.env.NODE_ENV === 'development') {
                console.log('📧 Development mode: logging email content instead:');
                console.log(`To: ${options.to}`);
                console.log(`Subject: ${options.subject}`);
                console.log(`Content: ${options.textContent || 'HTML content provided'}`);
                return true;
            }
            
            return false;
        }
    }

    async sendResetPasswordEmail(email: string, resetToken: string): Promise<boolean> {
        const { generateResetPasswordEmail } = await import('../utils/emailTemplates.js');
        const htmlContent = generateResetPasswordEmail(resetToken, email);
        
        return this.sendEmail({
            to: email,
            subject: '🔒 Đặt lại mật khẩu - PTIT Job',
            htmlContent,
            textContent: `
Xin chào,

Bạn đã yêu cầu đặt lại mật khẩu cho tài khoản PTIT Job.

Mã xác thực của bạn: ${resetToken}

Mã này có hiệu lực trong 1 giờ.

Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.

Trân trọng,
Đội ngũ PTIT Job
            `.trim()
        });
    }

    async sendPasswordResetSuccessEmail(email: string): Promise<boolean> {
        const { generatePasswordResetSuccessEmail } = await import('../utils/emailTemplates.js');
        const htmlContent = generatePasswordResetSuccessEmail(email);
        
        return this.sendEmail({
            to: email,
            subject: '✅ Mật khẩu đã được đặt lại thành công - PTIT Job',
            htmlContent,
            textContent: `
Xin chào,

Mật khẩu cho tài khoản ${email} đã được đặt lại thành công vào lúc ${new Date().toLocaleString('vi-VN')}.

Bạn có thể đăng nhập ngay bây giờ với mật khẩu mới.

Nếu bạn không thực hiện thao tác này, vui lòng liên hệ với chúng tôi ngay lập tức.

Trân trọng,
Đội ngũ PTIT Job
            `.trim()
        });
    }

    async sendWelcomeEmail(email: string, fullName: string): Promise<boolean> {
        const htmlContent = `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Chào mừng đến với PTIT Job</title>
    <style>
        body {
            font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
            line-height: 1.6;
            color: #333;
            max-width: 600px;
            margin: 0 auto;
            padding: 20px;
            background-color: #f4f4f4;
        }
        .container {
            background-color: white;
            padding: 30px;
            border-radius: 10px;
            box-shadow: 0 0 10px rgba(0,0,0,0.1);
        }
        .header {
            text-align: center;
            margin-bottom: 30px;
        }
        .logo {
            font-size: 32px;
            font-weight: bold;
            color: #1976d2;
            margin-bottom: 20px;
        }
        .welcome-icon {
            font-size: 48px;
            margin: 20px 0;
        }
        .footer {
            margin-top: 30px;
            padding-top: 20px;
            border-top: 1px solid #eee;
            text-align: center;
            color: #666;
            font-size: 14px;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🎯 PTIT Job</div>
            <div class="welcome-icon">🎉</div>
            <h2 style="color: #1976d2; margin: 0;">Chào mừng bạn đến với PTIT Job!</h2>
        </div>
        
        <p>Xin chào <strong>${fullName}</strong>,</p>
        
        <p>Chúc mừng bạn đã đăng ký thành công tài khoản tại PTIT Job!</p>
        
        <p>Tại PTIT Job, bạn có thể:</p>
        <ul>
            <li>🔍 Tìm kiếm công việc phù hợp</li>
            <li>📄 Tạo và quản lý hồ sơ cá nhân</li>
            <li>💼 Ứng tuyển vào các vị trí yêu thích</li>
            <li>🏢 Kết nối với các nhà tuyển dụng</li>
        </ul>
        
        <p>Hãy bắt đầu hành trình tìm kiếm cơ hội nghề nghiệp của bạn ngay hôm nay!</p>
        
        <p>Nếu bạn có bất kỳ câu hỏi nào, đừng ngần ngại liên hệ với chúng tôi qua email: 
           <a href="mailto:support@ptitjob.com">support@ptitjob.com</a></p>
        
        <div class="footer">
            <p>© 2024 PTIT Job. Tất cả quyền được bảo lưu.</p>
            <p>Đây là email tự động, vui lòng không trả lời.</p>
        </div>
    </div>
</body>
</html>
        `;

        return this.sendEmail({
            to: email,
            subject: '🎉 Chào mừng đến với PTIT Job!',
            htmlContent,
            textContent: `
Xin chào ${fullName},

Chúc mừng bạn đã đăng ký thành công tài khoản tại PTIT Job!

Tại PTIT Job, bạn có thể:
- Tìm kiếm công việc phù hợp
- Tạo và quản lý hồ sơ cá nhân  
- Ứng tuyển vào các vị trí yêu thích
- Kết nối với các nhà tuyển dụng

Hãy bắt đầu hành trình tìm kiếm cơ hội nghề nghiệp của bạn ngay hôm nay!

Trân trọng,
Đội ngũ PTIT Job
            `.trim()
        });
    }

    private stripHtml(html: string): string {
        return html
            .replace(/<[^>]*>/g, '')
            .replace(/\s+/g, ' ')
            .trim();
    }

    // Test email functionality
    async testEmailConnection(): Promise<boolean> {
        try {
            await this.transporter.verify();
            console.log('✅ Email connection test successful');
            return true;
        } catch (error: any) {
            console.error('❌ Email connection test failed:', error.message);
            return false;
        }
    }
}

// Export singleton instance
export const emailService = new EmailService();
export default emailService;