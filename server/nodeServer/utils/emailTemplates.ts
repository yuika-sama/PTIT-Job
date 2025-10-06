export const generateResetPasswordEmail = (resetToken: string, userEmail: string): string => {
    const resetUrl = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/forgot-password?token=${resetToken}`;
    
    return `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Đặt lại mật khẩu - PTIT Job</title>
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
            font-size: 28px;
            font-weight: bold;
            color: #1976d2;
            margin-bottom: 10px;
        }
        .reset-button {
            text-align: center;
            margin: 30px 0;
        }
        .button {
            display: inline-block;
            background-color: #1976d2;
            color: white !important;
            padding: 15px 30px;
            text-decoration: none;
            border-radius: 8px;
            font-size: 16px;
            font-weight: bold;
            margin: 10px 0;
            transition: background-color 0.3s;
        }
        .button:hover {
            background-color: #1565c0;
        }
        .alternative-method {
            background-color: #f8f9fa;
            border: 1px solid #dee2e6;
            border-radius: 8px;
            padding: 20px;
            margin: 20px 0;
        }
        .token-code {
            background-color: #f8f9fa;
            border: 2px dashed #1976d2;
            border-radius: 8px;
            padding: 15px;
            text-align: center;
            margin: 15px 0;
        }
        .code {
            font-size: 18px;
            font-weight: bold;
            color: #1976d2;
            letter-spacing: 2px;
            font-family: 'Courier New', monospace;
            word-break: break-all;
        }
        .warning {
            background-color: #fff3cd;
            border: 1px solid #ffeaa7;
            border-radius: 5px;
            padding: 15px;
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
        .expiry-info {
            text-align: center;
            color: #dc3545;
            font-weight: bold;
            margin: 15px 0;
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="header">
            <div class="logo">🎯 PTIT Job</div>
            <h2 style="color: #333; margin: 0;">Đặt lại mật khẩu</h2>
        </div>
        
        <p>Xin chào,</p>
        
        <p>Chúng tôi nhận được yêu cầu đặt lại mật khẩu cho tài khoản <strong>${userEmail}</strong>.</p>
        
        <p>Nhấn vào nút bên dưới để đặt lại mật khẩu của bạn:</p>
        
        <div class="reset-button">
            <a href="${resetUrl}" class="button">
                🔒 Đặt lại mật khẩu
            </a>
        </div>
        
        <div class="expiry-info">
            ⏰ Link này có hiệu lực trong 1 giờ
        </div>
        
        <div class="alternative-method">
            <h4 style="margin-top: 0; color: #495057;">Cách thay thế:</h4>
            <p style="margin-bottom: 10px;">Nếu nút trên không hoạt động, bạn có thể:</p>
            <ol style="margin: 10px 0 10px 20px; padding: 0;">
                <li>Truy cập: <a href="${process.env.FRONTEND_URL || 'http://localhost:3000'}/forgot-password" target="_blank">${process.env.FRONTEND_URL || 'http://localhost:3000'}/forgot-password</a></li>
                <li>Nhập mã xác thực bên dưới:</li>
            </ol>
            
            <div class="token-code">
                <p style="margin: 0; font-size: 14px; color: #666;">Mã xác thực:</p>
                <div class="code">${resetToken}</div>
            </div>
        </div>
        
        <div class="warning">
            <strong>⚠️ Lưu ý bảo mật:</strong>
            <ul style="margin: 10px 0 0 20px; padding: 0;">
                <li>Không chia sẻ link hoặc mã này với bất kỳ ai</li>
                <li>PTIT Job sẽ không bao giờ yêu cầu thông tin này qua điện thoại</li>
                <li>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này</li>
                <li>Link sẽ tự động hết hạn sau 1 giờ vì lý do bảo mật</li>
            </ul>
        </div>
        
        <p>Nếu bạn gặp vấn đề gì, vui lòng liên hệ với chúng tôi qua email: 
           <a href="mailto:support@ptitjob.com">support@ptitjob.com</a></p>
        
        <div class="footer">
            <p>© 2024 PTIT Job. Tất cả quyền được bảo lưu.</p>
            <p>Đây là email tự động, vui lòng không trả lời.</p>
            <p style="font-size: 12px; color: #999;">
                Nếu bạn gặp sự cố với các link trong email này, hãy copy và paste chúng vào trình duyệt của bạn.
            </p>
        </div>
    </div>
</body>
</html>
    `;
};

export const generatePasswordResetSuccessEmail = (userEmail: string): string => {
    return `
<!DOCTYPE html>
<html lang="vi">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Mật khẩu đã được đặt lại - PTIT Job</title>
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
            font-size: 28px;
            font-weight: bold;
            color: #4caf50;
            margin-bottom: 10px;
        }
        .success-icon {
            font-size: 48px;
            color: #4caf50;
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
            <div class="success-icon">✅</div>
            <h2 style="color: #4caf50; margin: 0;">Mật khẩu đã được đặt lại thành công!</h2>
        </div>
        
        <p>Xin chào,</p>
        
        <p>Mật khẩu cho tài khoản <strong>${userEmail}</strong> đã được đặt lại thành công vào lúc ${new Date().toLocaleString('vi-VN')}.</p>
        
        <p>Bạn có thể đăng nhập ngay bây giờ với mật khẩu mới.</p>
        
        <p>Nếu bạn không thực hiện thao tác này, vui lòng liên hệ với chúng tôi ngay lập tức qua email: 
           <a href="mailto:support@ptitjob.com">support@ptitjob.com</a></p>
        
        <div class="footer">
            <p>© 2024 PTIT Job. Tất cả quyền được bảo lưu.</p>
            <p>Đây là email tự động, vui lòng không trả lời.</p>
        </div>
    </div>
</body>
</html>
    `;
};