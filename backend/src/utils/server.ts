import express, { Request, Response } from 'express';
import responseTime from 'response-time';
import deserialiseUser from '../middleware/deserialiseUser';
import routes from '../routes';
import { restResponseTimeHistogram } from './metrics';
import config from 'config';
import cors, { CorsOptions } from 'cors';

function createServer() {
    const app = express();

    app.use(express.json())
    app.use(deserialiseUser);

    const whitelist = config.get<string>('corsDomains');

    const corsOptions: CorsOptions = {
        origin: function (origin, callback) {
            if (!origin || whitelist.indexOf(origin) !== -1) {
                callback(null, true);
            } else {
                callback(new Error("Not allowed by CORS"));
            }
        },
        credentials: true,
        exposedHeaders: ['Content-Range']
    }

    app.use(cors(corsOptions));

    app.use(responseTime((req: Request, res: Response, time: number) => {
        if (req.route?.path) {
            restResponseTimeHistogram.observe({
                method: req.method,
                route: req.route.path,
                status_code: res.statusCode,
            }, time * 1000)
        }
    }))

    routes(app);

    return app;
}

export default createServer;