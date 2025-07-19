import * as glob from 'glob'
import { PlatformTools } from '../tools'

export interface IFileDiscoveryService {
  discoverFiles(paths: string[]): string[];
}

export class FileDiscoveryService implements IFileDiscoveryService {
  private readonly supportedExtensions = ['.js', '.jsx', '.mjs', '.cjs', '.ts', '.tsx', '.mts', '.cts']

  discoverFiles(paths: string[]): string[] {
    const allFiles = this.expandPathsToFiles(paths)
    return this.filterSupportedFiles(allFiles)
  }

  private expandPathsToFiles(paths: string[]): string[] {
    return paths.reduce(
      (allFiles, path) => allFiles.concat(glob.sync(PlatformTools.pathNormalize(path))),
      [] as string[]
    )
  }

  private filterSupportedFiles(files: string[]): string[] {
    return files.filter(file => file != null && this.isValidFile(file))
  }

  private isValidFile(file: string): boolean {
    if (!file || typeof file !== 'string') return false
    const extension = PlatformTools.pathExtname(file)
    const isTypeDefinition = file.endsWith('.d.ts')

    return this.supportedExtensions.includes(extension) && !isTypeDefinition
  }
}