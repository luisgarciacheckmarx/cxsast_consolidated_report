import soap = require('soap')
import { config } from '../utils'

const baseURL: string = `${config.host}/CxWebInterface/Portal/CxWebService.asmx?WSDL`

const login = (client: any) =>
  new Promise((resolve, reject) => {
    const loginData = {
      applicationCredentials: {
        User: config.username,
        Pass: config.password,
      },
      lcid: 1033,
    }

    client.Login(loginData, (_err: any, { LoginResult }: any) => {
      const { IsSuccesfull, SessionId } = LoginResult

      return IsSuccesfull
        ? resolve(SessionId)
        : reject({
            message: 'Soap failed to login! Check the username and password for Checkmarx',
          })
    })
  })

const getClient = () =>
  new Promise((resolve, reject) => {
    soap.createClient(baseURL, (err, client) => (err ? reject(err) : resolve(client)))
  })

const soapService = (() => {
  let instance: any

  async function init() {
    const client: any = await getClient()
    const sessionData: any = {
      sessionID: await login(client),
    }
    return { client, sessionData }
  }

  return {
    getInstance: async () => {
      if (!instance) {
        instance = init()
      }

      return instance
    },
  }
})()

export default soapService
