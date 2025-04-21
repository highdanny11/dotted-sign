import pino from 'pino'
import pretty from 'pino-pretty'

function getLogger (prefix: string, logLevel = 'debug') {
  return pino(pretty({
    levelLabel: logLevel,
    messageFormat: `[${prefix}]: {msg}`,
    colorize: true,
    sync: true
  }))
}

export default getLogger