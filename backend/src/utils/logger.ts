import logger from 'pino';
import dayjs from 'dayjs';

// const transport = pino.transport({
//     target: 'pino-pretty',
//     options: { colorize: true }
// })

const log = logger({
    prettifier: require('pino-pretty'),
    base: {
        pid: false
    },
    timestamp: () => `,"time": ${dayjs().format()}"`,
})

export default log;