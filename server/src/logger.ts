import pino from 'pino'

const logger = pino({
  transport: {
    target: 'pino-pretty',
    options: {
      translateTime: true,
      colorize: true,
      ignore: 'pid,hostname',
    },
  },
})

export default logger
