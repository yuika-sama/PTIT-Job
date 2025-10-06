import jwt from 'jsonwebtoken';
import type { Context } from 'elysia';

export interface JwtPayload {
    userId: string;
    email: string;
    role: string;
}

export class AuthMiddleware {
    private static readonly JWT_SECRET = process.env.JWT_SECRET || 'my key';
    private static readonly JWT_REFRESH_SECRET = process.env.JWT_REFRESH_SECRET || 'my refesh key';

    static async verifyToken(context: any) {
        try {
            const authHeader = context.headers.authorization;
            
            if (!authHeader) {
                context.set.status = 401;
                return {
                    success: false,
                    message: 'Access token is required'
                };
            }

            const token = authHeader.startsWith('Bearer ') 
                ? authHeader.slice(7) 
                : authHeader;

            if (!token) {
                context.set.status = 401;
                return {
                    success: false,
                    message: 'Access token is required'
                };
            }

            const decoded = jwt.verify(token, this.JWT_SECRET) as JwtPayload;
            context.user = decoded;
            
            return true;
        } catch (error) {
            if (error instanceof jwt.TokenExpiredError) {
                context.set.status = 401;
                return {
                    success: false,
                    message: 'Token has expired'
                };
            } else if (error instanceof jwt.JsonWebTokenError) {
                context.set.status = 401;
                return {
                    success: false,
                    message: 'Invalid token'
                };
            } else {
                context.set.status = 500;
                return {
                    success: false,
                    message: 'Internal server error'
                };
            }
        }
    }

    static generateAccessToken(payload: JwtPayload): string {
        return jwt.sign(payload as any, this.JWT_SECRET, { 
            expiresIn: '24h'
        });
    }

    static generateRefreshToken(payload: JwtPayload): string {
        return jwt.sign(payload as any, this.JWT_REFRESH_SECRET, { 
            expiresIn: '7d'
        });
    }

    static verifyRefreshToken(token: string): JwtPayload {
        return jwt.verify(token, this.JWT_REFRESH_SECRET) as JwtPayload;
    }

    // Middleware để check role
    static requireRole(allowedRoles: string[]) {
        return async (context: any) => {
            const authResult = await this.verifyToken(context);
            
            if (authResult !== true) {
                return authResult;
            }

            const userRole = context.user?.role;
            if (!allowedRoles.includes(userRole)) {
                context.set.status = 403;
                return {
                    success: false,
                    message: 'Insufficient permissions'
                };
            }

            return true;
        };
    }

    // Middleware để check ownership (user chỉ có thể truy cập data của chính mình)
    static requireOwnership() {
        return async (context: any) => {
            const authResult = await this.verifyToken(context);
            
            if (authResult !== true) {
                return authResult;
            }

            const userId = context.params?.id || context.params?.userId;
            if (userId && userId !== context.user?.userId) {
                context.set.status = 403;
                return {
                    success: false,
                    message: 'You can only access your own data'
                };
            }

            return true;
        };
    }
}