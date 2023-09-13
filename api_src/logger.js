// For more information about this file see https://dove.feathersjs.com/guides/cli/logging.html
import { createLogger, format, transports, addColors } from 'winston'

let myDate = new Date()


addColors({ message: 'green' });
addColors({ level: 'bold cyan' });
const colorizer = format.colorize();
// Configure the Winston logger. For the complete documentation see https://github.com/winstonjs/winston
export const logger = createLogger({
  // To see more detailed errors, change this to 'debug'
  level: 'info',
  format: format.combine(
    //format.colorize({ all: true }),
    format.timestamp({
      format: 'DD/MM/YYYY hh:mm:ss.SSS A',
    }),
    format.splat(), 
    format.simple(),
    format.align(),
    format.printf((info) => `[${info.timestamp}] ${colorizer.colorize('level',info.level)}: ${colorizer.colorize('message',info.message)}`)
    ),
  transports: [new transports.Console(),new transports.File({
    filename: 'apisrv.log',
  })]
})
