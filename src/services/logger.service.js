export class LoggerService {
  userName
  constructor(userName) {
    this.userName = userName
  }

  logGreeting() {
    console.log(`Welcome to the File Manager, ${this.userName}!`)
  }

  logDirectory(workingDirPath) {
    console.log(`You are currently in ${workingDirPath}`)
  }

  logFiles(files) {
    console.table(files)
  }

  log(data) {
    console.log(data)
  }

  logByeMessage() {
    console.log(`\nThank you for using File Manager, ${this.userName}, goodbye!!`)
  }
}