import { Request, Response, NextFunction } from 'express';
import { AuthenticatedRequest } from '../types';
export declare const adminAuth: (req: Request, res: Response, next: NextFunction) => void;
export declare const apiKeyAuth: (req: Request, res: Response, next: NextFunction) => void;
export declare const optionalAuth: (req: AuthenticatedRequest, res: Response, next: NextFunction) => void;
export declare const generateAdminToken: (username: string) => string;
//# sourceMappingURL=auth.d.ts.map