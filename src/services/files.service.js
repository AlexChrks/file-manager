import {readdir, rm} from "fs/promises";
import path from "path";
import {createReadStream, createWriteStream} from "fs";
import {EOL} from "os";

export class FilesService {
  loggerService
  currentDirectoryPath
  homeDirectoryPath

  constructor(initDir, loggerService) {
    this.currentDirectoryPath = initDir
    this.homeDirectoryPath = initDir
    this.loggerService = loggerService
    process.chdir(initDir)
  }

  getCurrentDirectory() {
    return this.currentDirectoryPath
  }

  goUpFromCurrentDirectory() {
    try {
      const newPath = this.currentDirectoryPath + path.sep + '..'
      process.chdir(newPath)
      this.setCurrentDirectory(process.cwd())
    } catch (e) {
      this.loggerService.log(e.message)
    }
  }

  async changeDirectory(newPath) {
      try {
        process.chdir(newPath)
        this.setCurrentDirectory(process.cwd())
      } catch (e) {
        console.log(e.message)
      }
    }

  async renameFile(pathToFile, newFileName) {
    try {
      if (pathToFile && newFileName) {
        const normalizedPath = path.normalize(pathToFile)
        const directory = path.dirname(normalizedPath)
        const newPath = `${directory}${path.sep}${newFileName}`

        const readable = createReadStream(normalizedPath)
        const writable = createWriteStream(newPath)

        readable.pipe(writable)
        readable.destroy()

        await rm(normalizedPath)
        console.log(`Successfully renamed`)

      }
    } catch (e) {
      console.log(e.message)
    }
  }

  setCurrentDirectory(newDirectory) {
    this.currentDirectoryPath = newDirectory
  }

  async getCurrentDirectoryFiles() {
    try {
      const files = await readdir(this.currentDirectoryPath)
      const arr = files.map((file) => {
        return {
          Name: file,
          Type: path.extname(file) ? 'file' : 'directory'
        }
      })
      const filesArr = arr
        .filter((item) => item.Type === 'file')
        .sort((item1, item2) => item1.Name.toLowerCase().replaceAll('.', '').localeCompare(item2.Name.toLowerCase().replaceAll('.', '')))
      const dirsArr = arr
        .filter((item) => item.Type === 'directory')
        .sort((item1, item2) => item1.Name.toLowerCase().replaceAll('.', '').localeCompare(item2.Name.toLowerCase().replaceAll('.', '')))

      return [...dirsArr, ...filesArr]

    } catch (e) {
      this.loggerService.log(e.message)
    }

  }

  async readFile(pathToFile) {
    try {
      const readable = createReadStream(pathToFile)
      readable.pipe(process.stdout)

      readable.on('error', (e) => {
        this.loggerService.log(e.message)
        this.loggerService.logDirectory(this.currentDirectoryPath)
      })

      readable.on('end', () => {
        process.stdout.write(EOL)
        this.loggerService.logDirectory(this.currentDirectoryPath)
      })
    } catch (e) {
      this.loggerService.log(e.message)
    }
  }

  async addFile(newFileName) {
    try {
      const fullNewFilePath = `${this.currentDirectoryPath}/${newFileName}`
      const writeable = createWriteStream(fullNewFilePath)
      writeable.close()
      this.loggerService.log(`New file has been added -> ${fullNewFilePath}`)
      this.loggerService.logDirectory(this.currentDirectoryPath)
      writeable.on('error', (e) => {
        this.loggerService.log(e.message)
        this.loggerService.logDirectory(this.currentDirectoryPath)
      })
    } catch (e) {
      this.loggerService.log(e.message)
    }
  }

  async copyFile(pathToFile, pathToNewDir) {
    try {
      const normalizedSourceFilePath = path.normalize(pathToFile)
      const fileName = path.parse(normalizedSourceFilePath).base
      const normalizedDestinationPath = path.normalize(pathToNewDir)

      const readable = createReadStream(normalizedSourceFilePath)
      const writable = createWriteStream(normalizedDestinationPath + path.sep + fileName)

      readable.pipe(writable)
      readable.destroy()
      writable.destroy()
      this.loggerService.log(`Successfully copied`)
      this.loggerService.logDirectory(this.currentDirectoryPath)
    } catch (e) {
      this.loggerService.log(e.message)
    }
  }

  async moveFile(pathToFile, pathToNewDir) {
    try {
      const normalizedSourceFilePath = path.normalize(pathToFile)
      const fileName = path.parse(normalizedSourceFilePath).base
      const normalizedDestinationPath = path.normalize(pathToNewDir)

      const readable = createReadStream(normalizedSourceFilePath)
      const writable = createWriteStream(normalizedDestinationPath + path.sep + fileName)

      readable.pipe(writable)
      readable.destroy()
      writable.destroy()

      await rm(normalizedSourceFilePath)
      this.loggerService.log(`Successfully moved`)
      this.loggerService.logDirectory(this.currentDirectoryPath)
    } catch (e) {
      this.loggerService.log(e.message)
    }
  }

  async deleteFile(pathToFile) {
    try {
      const normalizedSourceFilePath = path.normalize(pathToFile)
      await rm(normalizedSourceFilePath)
      this.loggerService.log(`Successfully deleted`)
      this.loggerService.logDirectory(this.currentDirectoryPath)
    } catch (e) {
      this.loggerService.log(e.message)
    }
  }
}