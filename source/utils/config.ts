import dotenv from 'dotenv'
dotenv.config()

import { env } from 'process'
import { logger } from '../utils'

const log = logger('cx client config')

const getConfig = () => {
  try {
    return require(process.cwd() + '/config.json')
  } catch (error) {
    log.info('Config file not found!')

    return {
      host: process.env.CX_API_URL,
      username: process.env.CX_USERNAME,
      password: process.env.CX_PASSWORD,
      clientSecret: process.env.CX_CLIENT_SECRET,
      appName: env.APP_NAME,
      projectNames: env.PROJECT_NAMES,
      projectNamesPattern: env.PROJECT_NAMES_PATTERN,
      email: {
        service: env.EMAIL_SERVICE,
        sender: env.EMAIL_SENDER,
        password: env.EMAIL_PASSWORD,
        recievers: env.EMAIL_RECIEVERS,
        subject: env.EMAIL_SUBJECT,
      },
    }
  }
}

const config = getConfig()

export default config
