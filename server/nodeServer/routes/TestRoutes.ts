import { Elysia } from 'elysia';
import { emailService } from '../services/emailService.js';

export const TestRoutes = new Elysia({ prefix: '/test' })
    .post('/email', async (context) => {
        try {
            const { to, type } = context.body as { to: string; type: 'welcome' | 'reset' | 'success' };
            
            if (!to) {
                context.set.status = 400;
                return {
                    success: false,
                    message: 'Email address is required'
                };
            }

            let result: boolean = false;

            switch (type) {
                case 'welcome':
                    result = await emailService.sendWelcomeEmail(to, 'Test User');
                    break;
                case 'reset':
                    result = await emailService.sendResetPasswordEmail(to, 'TEST123456');
                    break;
                case 'success':
                    result = await emailService.sendPasswordResetSuccessEmail(to);
                    break;
                default:
                    context.set.status = 400;
                    return {
                        success: false,
                        message: 'Invalid email type. Use: welcome, reset, or success'
                    };
            }

            return {
                success: result,
                message: result ? 'Test email sent successfully' : 'Failed to send test email'
            };
        } catch (error: any) {
            context.set.status = 500;
            return {
                success: false,
                message: error.message || 'Failed to send test email'
            };
        }
    }, {
        detail: {
            tags: ['Testing'],
            summary: 'Send test email',
            description: 'Send test emails for development purposes'
        }
    })
    .get('/email-config', async (context) => {
        try {
            const isConfigured = Boolean(process.env.EMAIL_USER && process.env.EMAIL_PASS);
            const connectionTest = await emailService.testEmailConnection();

            return {
                success: true,
                data: {
                    service: process.env.EMAIL_SERVICE || 'default',
                    configured: isConfigured,
                    connectionOk: connectionTest,
                    host: process.env.EMAIL_HOST || 'Not configured',
                    port: process.env.EMAIL_PORT || 'Not configured',
                    user: process.env.EMAIL_USER || 'Not configured',
                    hasPassword: Boolean(process.env.EMAIL_PASS),
                    isMailtrap: process.env.EMAIL_SERVICE === 'mailtrap',
                    mailtrapUrl: process.env.EMAIL_SERVICE === 'mailtrap' ? 'https://mailtrap.io/inboxes' : null
                },
                message: 'Email configuration status'
            };
        } catch (error: any) {
            context.set.status = 500;
            return {
                success: false,
                message: error.message || 'Failed to check email configuration'
            };
        }
    }, {
        detail: {
            tags: ['Testing'],
            summary: 'Check email configuration',
            description: 'Check email service configuration and connection'
        }
    });

export default TestRoutes;