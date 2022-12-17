import { EOL, cpus, homedir, userInfo, arch } from 'os'

export class OsService {
  loggerService
  constructor(loggerService) {
    this.loggerService = loggerService
  }

  getOSInfo(argument) {
    if (!argument) {
      this.loggerService.log('ERROR: no argument provided')
    }

    switch (argument) {
      case '--EOL':
        this.loggerService.log(JSON.stringify(EOL).replaceAll('"', ''))
        break

      case '--cpus':
        const coreCPUS = cpus()
        const data = coreCPUS.map(it => it.model)

        const obj = {
          amount: coreCPUS.length,
          data: data
        }

        this.loggerService.log(obj)
        break

      case '--homedir':
        const homeDir = homedir()
        this.loggerService.log(`Homedir: ${homeDir}`)
        break

      case '--username':
        const {username} = userInfo()
        this.loggerService.log(`Username: ${username}`)
        break

      case '--architecture':
        const architecture = arch()
        this.loggerService.log(`CPU architecture: ${architecture}`)
        break
      default :
        this.loggerService.log('Operation failed: unknown argument')
    }
  }
}

export default OsService