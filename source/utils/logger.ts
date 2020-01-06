import logger = require('log4js')

logger.configure({
  appenders: {
    stdout: {
      type: 'stdout',
      layout: { type: 'pattern', pattern: '[%d] [%p] [cx reports generator] - %-15.15c : %m' },
    },
  },
  categories: { default: { appenders: ['stdout'], level: 'INFO' } },
})

export const log = (el: string) => logger.getLogger(el)

export const logElapsedTime = (startHrTime: [number, number], message: string = '', instance: string = '') => {
  const elapsedHrTime = process.hrtime(startHrTime)
  const elapsedTimeInMs = (elapsedHrTime[0] * 1e9 + elapsedHrTime[1]) / 1e6
  const total = parseFloat(elapsedTimeInMs.toString()).toFixed(3)

  logger.getLogger(instance).info(`${message} execution took ${total}ms`)
}
