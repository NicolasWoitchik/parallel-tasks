import { PlatformTools } from '../tools'
import { importOrRequireFile } from './import-utils'

/**
 * Service interface for dynamically importing modules from file paths.
 *
 * Handles the complexity of loading TypeScript/JavaScript modules at runtime,
 * supporting both CommonJS and ES modules with proper error handling.
 *
 * @internal
 * @interface IModuleImportService
 */
export interface IModuleImportService {
  /**
   * Dynamically imports multiple modules from the provided file paths.
   *
   * Uses dynamic import() to load modules asynchronously, handling both
   * absolute and relative paths. Failed imports are logged but don't
   * interrupt the loading of other modules.
   *
   * @param filePaths - Array of file paths to import (absolute or relative)
   * @returns Promise resolving to an array of imported module objects
   *
   * @throws {Error} If a critical import failure occurs
   *
   * @example
   * ```typescript
   * const service = new ModuleImportService();
   * const modules = await service.importModules([
   *   './tasks/user-validation.task.ts',
   *   './tasks/data-processing.task.ts',
   *   '/absolute/path/to/task.ts'
   * ]);
   * ```
   */
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  importModules(filePaths: string[]): Promise<any[]>
}

export class ModuleImportService implements IModuleImportService {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  async importModules(filePaths: string[]): Promise<any[]> {
    const importPromises = filePaths.map(filePath =>
      this.importSingleModule(filePath)
    )
    const results = await Promise.allSettled(importPromises)

    return (
      results
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        .filter(
          (result): result is PromiseFulfilledResult<unknown> =>
            result.status === 'fulfilled'
        )
        .map(result => result.value)
    )
  }

  private async importSingleModule(filePath: string): Promise<unknown> {
    const resolvedPath = PlatformTools.pathResolve(filePath)
    const [importResult] = await importOrRequireFile(resolvedPath)
    return importResult
  }
}
