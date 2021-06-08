import { createLogger, format, transports } from 'winston'

const logger = createLogger({
  level: 'info',
  format: format.combine(
    format.timestamp({
      format: 'YYYY-MM-DD HH:mm:ss',
    }),
    format.errors({ stack: true }),
    format.splat(),
    format.json(),
  ),
  defaultMeta: { service: 'worffl' },
  transports: [
    //
    // - Write to all logs with level `info` and below to `quick-start-combined.log`.
    // - Write all logs error (and below) to `quick-start-error.log`.
    //
    new transports.File({ filename: '/home/jcde/sirius/logs/error.log', level: 'error' }),
    new transports.File({ filename: '/home/jcde/sirius/logs/combined.log' }),
    new transports.Console({
      format: format.combine(format.timestamp(), format.colorize(), format.simple()),
    }),
  ],
})

//
// If we're not in production then **ALSO** log to the `console`
// with the colorized simple format.
//
/* if (process.env.NODE_ENV !== 'production') {
  logger.add(
    new transports.Console({
      format: format.combine(format.timestamp(), format.colorize(), format.simple()),
    }),
  )
} */

export default logger
