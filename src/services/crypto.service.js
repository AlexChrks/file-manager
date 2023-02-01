
import {createHash} from "crypto";
import { createReadStream } from 'fs'
import {EOL} from "os";

class CryptoService {
  loggerService
  fileService
  constructor(loggerService, fileService) {
    this.loggerService = loggerService
    this.fileService = fileService
  }

  async calculateHash(pathToFile) {
    try {
      const readable = createReadStream(pathToFile)

      readable.on('data', (chunk) => {
        const hash = createHash('sha256');
        hash.update(chunk);

        const hex = hash.digest('hex');
        process.stdout.write(hex)
        process.stdout.write(EOL)

      })

      readable.on('end', () => this.loggerService.logDirectory(this.fileService.getCurrentDirectory()))

      readable.on("error", (err) => this.loggerService.log(err.message))
    } catch (e) {
      this.loggerService.log(e)
    }


  }
}

export default CryptoService