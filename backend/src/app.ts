import config from 'config';
import connect from './utils/connect';
import responseTime from 'response-time';
import logger from './utils/logger';
import createServer from './utils/server';
import swaggerDocs from './utils/swagger';
import { startMetricsServer } from './utils/metrics';
import schedule from 'node-schedule';
import { createXeroTimePayRun } from './services/xero.service';
import dayjs from 'dayjs';

const port = config.get<number>('port');

const app = createServer();

const rule = new schedule.RecurrenceRule();
rule.dayOfWeek = [4];
rule.hour = 3;
rule.minute = 48;
rule.tz = "Australia/Brisbane";

const job = schedule.scheduleJob('0 3 ? * 4', () => {

    let now = dayjs();

    console.log('now', now);

    let frmStartDate = dayjs(now).format('MM/DD/YYYY');

    console.log('frmStartDate', frmStartDate);

    createXeroTimePayRun(frmStartDate)
})

const startTime = new Date(Date.now() + 5000);
const endTime = new Date(startTime.getTime() + 5000);
const job2 = schedule.scheduleJob({ start: startTime, end: endTime, rule: '*/5 * * * * *' }, () => {
    console.log('hello!');
    console.log(job.nextInvocation());

    let nextRunDay = job.nextInvocation().toISOString();

    console.log('Job next run day', nextRunDay)

    let now = dayjs();

    console.log('now', now);

    let frmStartDate = dayjs(now).format('MM/DD/YYYY');

    console.log('frmStartDate', frmStartDate);
})

app.listen(port, async () => {
    logger.info(`JARVIS API is running at http://localhost:${port}`)

    await connect();

    startMetricsServer();
    swaggerDocs(app, port);

})