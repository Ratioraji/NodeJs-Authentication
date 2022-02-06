import express, {
    Application,
} from 'express';
import routers from './routes';
import winston from 'winston';
import expressWinston from 'express-winston';
import { connect } from './database';
import dotenv from 'dotenv';
import cors from 'cors';
dotenv.config();

(async ()=> {
    const app: Application = express();
    const port = 3000;
    await connect();
    app.use(cors());
    app.use(express.json());

    app.use(expressWinston.logger({
        transports: [
            new winston.transports.Console(),
        ],
        format: winston.format.combine(
            winston.format.json(),
            winston.format.prettyPrint(),
            winston.format.colorize({
                all: true,
            }),
        ),
    }));
    app.use('/api', routers);

    app.listen(port, () => {
        console.log('Server running on port 3000');
    });
})();
