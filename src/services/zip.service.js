import { createBrotliCompress, createBrotliDecompress } from "zlib";
import { createReadStream, createWriteStream } from "fs";

class ZipService {
  loggerService
  fileService

  constructor(loggerService, fileService) {
    this.loggerService = loggerService
    this.fileService = fileService
  }

  compress(pathToFile, pathToDestination) {
    try {
      const brotliCompress = createBrotliCompress();
      const readableStream = createReadStream(pathToFile);
      const writeableStream = createWriteStream(pathToDestination);

      writeableStream.on("finish", () => {
        this.loggerService.log(`Success: File ${pathToFile} compressed to ${pathToDestination}`)
        this.loggerService.logDirectory(this.fileService.getCurrentDirectory())
      } )
      readableStream.on('error', (err) => this.loggerService.log(err.message))
      writeableStream.on('error', (err) => this.loggerService.log(err.message))
      readableStream.pipe(brotliCompress).pipe(writeableStream)
    } catch (e) {
      this.loggerService.log(e.message)

    }

  }

  decompress(pathToFile, pathToDestination) {
    try {
      const brotliDecompress = createBrotliDecompress();
      const readableStream = createReadStream(pathToFile);
      const writeableStream = createWriteStream(pathToDestination);
      writeableStream.on("finish", () => {
        this.loggerService.log(`Success: File ${pathToFile} decompressed to ${pathToDestination}`)
        this.loggerService.logDirectory(this.fileService.getCurrentDirectory())
      } )
      readableStream.on('error', (err) => this.loggerService.log(err.message))
      writeableStream.on('error', (err) => this.loggerService.log(err.message))
      readableStream.pipe(brotliDecompress).pipe(writeableStream)
    } catch (e) {
      this.loggerService.log(e.message)
    }
  }
}

export default ZipService