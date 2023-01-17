import { Request, Response, NextFunction } from 'express';
import config from 'config';


const requireApiKey = (req: Request, res: Response, next: NextFunction) => {
    const user = res.locals.user;
    const apiKey = req.get('apiKey');


    if (!apiKey) {
        return res.sendStatus(403)
    }

    if (apiKey === config.get<string>('apiKey')) {
        return next();
    } else {
        return res.sendStatus(401);
    }
}

export default requireApiKey