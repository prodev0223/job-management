import mongoose from 'mongoose';
import config from 'config';
import logger from '../utils/logger';
require('dotenv').config();

async function connect() {
    let dbUri = process.env.DB_URI;
    let dbUser = process.env.DB_USER;
    let dbPass = process.env.DB_PASS;

    const isProduction = process.env.IS_PRODUCTION

    if (isProduction === 'false' || false) {
        dbUri = process.env.DB_DEV_URI
        dbUser = process.env.DB_DEV_USER;
        dbPass = process.env.DB_DEV_PASS;

        if (!dbUri) {
            logger.error('Could not find dbUri defined!')
            process.exit(1);
        }

        if (dbUri?.includes('localhost')) {
            try {
                logger.info(`DB URI ${dbUri}`)
                await mongoose.connect(dbUri);
                logger.info('Db connected!');
            } catch (error) {
                logger.error(`Could not connect to db  ${error}`)
                process.exit(1);
            }
        } else {
            try {
                logger.info(`DB URI ${dbUri}`)
                await mongoose.connect(dbUri, {
                    user: dbUser,
                    pass: dbPass
                });
                logger.info('Db connected!');
            } catch (error) {
                logger.error(`Could not connect to db  ${error}`)
                process.exit(1);
            }
        }

    } else {
        if (!dbUri) {
            logger.error('Could not find dbUri defined!')
            process.exit(1);
        }
        try {
            logger.info(`DB URI ${dbUri}`)
            await mongoose.connect(dbUri, {
                user: dbUser,
                pass: dbPass
            });
            logger.info('Db connected!');
        } catch (error) {
            logger.error(`Could not connect to db  ${error}`)
            process.exit(1);
        }
    }


}

export default connect;