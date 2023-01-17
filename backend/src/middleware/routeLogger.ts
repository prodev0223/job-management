import { Request, Response, NextFunction } from 'express';
import logger from '../utils/logger';

const routeLogger = (req: Request, res: Response, next: NextFunction) => {
    const path = req.url;

    const method = req.method

    const requestIP = req.ip
    logger.info(`${method} - ${path} from ${requestIP}`);
    return next();
}

export default routeLogger