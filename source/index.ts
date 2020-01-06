import dateFormat from 'dateformat'
import { setProjectsData, combinedResults, resultsByProject } from './controllers/scansController'
import { EmailService } from './services'
import { logger, config, handleError } from './utils'

const log = logger('main')

const main = async () => {
  log.info('fetching scans data ...')
  try {
    await setProjectsData()
    log.info('Finished the data fetch!')

    EmailService.sendEmail({
      combinedResults,
      resultsByProject,
      totalUnresolvedIssues: combinedResults.newIssues + combinedResults.recurrentIssues,
      currentDate: dateFormat(new Date(), 'dddd, mmmm dS, yyyy, h:MM:ss TT'),
      appName: config.appName,
    })
  } catch (error) {
    handleError(error)
  }
}

main()
