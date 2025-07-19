import { PlatformTools } from '../tools';
import { importOrRequireFile } from './import-utils';

export interface IModuleImportService {
  importModules(filePaths: string[]): Promise<any[]>;
}

export class ModuleImportService implements IModuleImportService {
  async importModules(filePaths: string[]): Promise<any[]> {
    const importPromises = filePaths.map(filePath => this.importSingleModule(filePath));
    return await Promise.all(importPromises);
  }

  private async importSingleModule(filePath: string): Promise<any> {
    const resolvedPath = PlatformTools.pathResolve(filePath);
    const [importResult] = await importOrRequireFile(resolvedPath);
    return importResult;
  }
} 