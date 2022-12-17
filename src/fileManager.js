import {LoggerService} from "./services/logger.service.js";
import {FileManagerService} from "./services/fileManager.service.js";
import {getUsername} from "./helpers/getUsername.js";
import { createReadStream, createWriteStream } from 'fs'
import { readdir, rm } from 'fs/promises'
import {fileURLToPath} from "url";
import path from "path";
import { homedir } from 'os'
import {FilesService} from "./services/files.service.js";
import OsService from "./services/os.service.js";
import CryptoService from "./services/crypto.service.js";
import ZipService from "./services/zip.service.js";
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const initFileManager = async () => {
  const logger = new LoggerService(getUsername())
  const filesService = new FilesService(homedir(), logger)
  const osService = new OsService(logger)
  const cryptoService = new CryptoService(logger, filesService)
  const zipService = new ZipService(logger, filesService)
  const fileManagerService = new FileManagerService(filesService, logger, osService, cryptoService, zipService)

  process.stdin.on('data', ( async (chunk) => {
    const inputData = chunk.toString().replace(/^\s+|\s+$/g, '')
    const inputArray = inputData.split(' ')

    const command = inputArray[0]
    const arg1 = inputArray[1]
    const arg2 = inputArray[2]

    switch (command) {

      case 'up':
        fileManagerService.up()
        break

      case 'cd':
        await fileManagerService.cd(arg1)
        break

      case 'ls':
        await fileManagerService.ls()
        break

      case 'cat':
        await fileManagerService.cat(arg1)
        break

      case 'add':
        await fileManagerService.add(arg1)
        break

      case 'rn':
        await fileManagerService.rn(arg1, arg2)
        break

      case 'cp':
        await fileManagerService.cp(arg1, arg2)
        break

      case 'mv':
        await fileManagerService.mv(arg1, arg2)
        break

      case 'rm':
        await fileManagerService.rm(arg1)
        break

      case 'os':
        await fileManagerService.os(arg1)
        break

      case 'hash':
        await fileManagerService.hash(arg1)
        break

      case 'compress':
        await fileManagerService.compress(arg1, arg2)
        break

      case 'decompress':
        await fileManagerService.decompress(arg1, arg2)
        break

      case 'rs':
        await filesService.changeDirectory('/Applications/RSSchool')
        logger.logDirectory(filesService.getCurrentDirectory())
        break


      case '.exit':
        logger.logByeMessage()
        process.exit()
        break

      case '.clean':
        console.clear()
        logger.logDirectory(filesService.getCurrentDirectory())
        break
      
      default:
        logger.log('Operation failed: unknown operation')
    }
  }) )

  process.on('SIGINT', () => {
    logger.logByeMessage()
    process.exit();
  });

  logger.logGreeting()
  logger.logDirectory(homedir())
}

await initFileManager()