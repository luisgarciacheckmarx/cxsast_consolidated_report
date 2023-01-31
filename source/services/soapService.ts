import soap = require('soap')
import { config, logger } from '../utils'


const log = logger('main');

const baseURL: string = `${config.host}/CxWebInterface/Portal/CxWebService.asmx?WSDL`

const login = (client: any) =>
  new Promise((resolve, reject) => {
    log.debug('LGV::login In login ...');
    const loginData = {
      applicationCredentials: {
        User: config.username,
        Pass: config.password,
      },
      lcid: 1033,
    }

    log.debug('LGV::login Go to client.Login ...');
    client.Login(loginData, (_err: any, { LoginResult }: any) => {
      const { IsSuccesfull, SessionId, ErrorMessage } = LoginResult

      log.debug('LGV::login Go to return IsSuccesfull (1)...');
      log.debug(IsSuccesfull);
      log.debug(ErrorMessage);
      log.debug('LGV::login Go to return IsSuccesfull (2)...');
      return IsSuccesfull
        ? resolve(SessionId)
        : reject({
            message: 'Soap failed to login! Check the username and password for Checkmarx',
          })
    })
  })

const getClient = () =>
  new Promise((resolve, reject) => {
    log.debug('LGV::getClient Go to soap.createClient ...');
    soap.createClient(baseURL, (err, client) => (err ? reject(err) : resolve(client)))
  })

const soapService = (() => {
  log.debug('LGV::soapService In soapService ...');
  let instance: any

  async function init() {
    log.debug('LGV::soapService In function ...');
    const client: any = await getClient()
    const sessionData: any = {
      sessionID: await login(client),
    }
    return { client, sessionData }
  }

  log.debug('LGV::soapService Go to  return ...');
  return {
    getInstance: async () => {
      log.debug('LGV::soapService Go to  if instance ...');
      if (!instance) {
        instance = init()
      }
      log.debug('LGV::soapService Go to  return instance ...');
      return instance
    },
  }
})()

export default soapService
