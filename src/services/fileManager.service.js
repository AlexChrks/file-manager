export class FileManagerService {
  filesService
  loggerService
  osService
  cryptoService
  zipService
  constructor(filesService, loggerService, osService, cryptoService, zipService) {
    this.filesService = filesService
    this.loggerService = loggerService
    this.osService = osService
    this.cryptoService = cryptoService
    this.zipService = zipService
  }

  up() {
    this.filesService.goUpFromCurrentDirectory()
    this.loggerService.logDirectory(this.filesService.getCurrentDirectory())
  }

  async cd(path) {
    await this.filesService.changeDirectory(path)
    this.loggerService.logDirectory(this.filesService.getCurrentDirectory())
  }

  async ls() {
    await this.filesService.getCurrentDirectoryFiles()
    this.loggerService.logFiles(await this.filesService.getCurrentDirectoryFiles())
    this.loggerService.logDirectory(this.filesService.getCurrentDirectory())
  }

  async cat(pathToFile) {
    await this.filesService.readFile(pathToFile)
  }

  async add(newFileName) {
    await this.filesService.addFile(newFileName)
  }

  async rn(pathToFile, newFileName) {
    if (pathToFile && newFileName) {
      await this.filesService.renameFile(pathToFile, newFileName)
      this.loggerService.logDirectory(this.filesService.getCurrentDirectory())
    } else {
      this.loggerService.log('Operation fail: invalid arguments')
      this.loggerService.logDirectory(this.filesService.getCurrentDirectory())
    }
  }

  async cp(pathToFile, pathToNewDir) {
    if (pathToFile && pathToNewDir) {
      await this.filesService.copyFile(pathToFile, pathToNewDir)
    } else {
      this.loggerService.log('Operation fail: invalid arguments')
      this.loggerService.logDirectory(this.filesService.getCurrentDirectory())
    }
  }

  async mv(pathToFile, pathToNewDir) {
    if (pathToFile && pathToNewDir) {
      await this.filesService.moveFile(pathToFile, pathToNewDir)
    } else {
      this.loggerService.log('Operation fail: invalid arguments')
      this.loggerService.logDirectory(this.filesService.getCurrentDirectory())
    }
  }

  async rm(pathToFile) {
    if (pathToFile) {
      await this.filesService.deleteFile(pathToFile)
    } else {
      this.loggerService.log('Operation fail: invalid arguments')
      this.loggerService.logDirectory(this.filesService.getCurrentDirectory())
    }
  }

  async os(arg) {
    await this.osService.getOSInfo(arg)
    this.loggerService.logDirectory(this.filesService.getCurrentDirectory())
  }

  async hash(pathToFile) {
    await this.cryptoService.calculateHash(pathToFile)
  }

  async compress(pathToFile, pathToDestination) {
    await this.zipService.compress(pathToFile, pathToDestination)
  }

  async decompress(pathToFile, pathToDestination) {
    await this.zipService.decompress(pathToFile, pathToDestination)
  }

}