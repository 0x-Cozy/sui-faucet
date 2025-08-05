import { Request, Response, NextFunction } from 'express';
interface ApiRequest extends Request {
    apiApp?: any;
}
export declare const apiKeyAuth: (req: ApiRequest, res: Response, next: NextFunction) => Promise<Response<any, Record<string, any>> | undefined>;
export {};
//# sourceMappingURL=apiKeyAuth.d.ts.map