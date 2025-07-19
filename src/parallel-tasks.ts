import { IParallelTasksOptions } from 'interfaces/parallel-tasks-options';
import { getMetadataArgsStorage } from './globals';
import { IParallelTasks } from './interfaces/register-task.interface';
import { PlatformTools } from './tools';
import { FileDiscoveryService } from './utils/file-discovery';
import { FileClassLoaderService } from './utils/file-class-loader';
import { ModuleImportService } from './utils/module-import';
import { NoTaskFoundException } from './exceptions/no-task-found.exeption';

export class ParallelTasks implements IParallelTasks {
  private readonly fileDiscoveryService: FileDiscoveryService;
  private readonly fileClassLoaderService: FileClassLoaderService;
  private readonly moduleImportService: ModuleImportService;

  constructor(private readonly options: IParallelTasksOptions) {
    this.fileDiscoveryService = new FileDiscoveryService();
    this.fileClassLoaderService = new FileClassLoaderService();
    this.moduleImportService = new ModuleImportService();
  }

  async execute<T, R>(taskName: string, context: T): Promise<R[]> {
    const metadataArgsStorage = getMetadataArgsStorage();

    const tasks = metadataArgsStorage.tasks.filter((t) => t.taskName === taskName);

    if (!tasks.length) {
      throw new NoTaskFoundException(taskName);
    }
    
    const results = await Promise.allSettled(tasks.map((task) => task.target(context)));

    return results.map((result) => {
      if (result.status === 'fulfilled') {
        return result.value;
      }
      return result.reason;
    });
  }

  async initialize(): Promise<Function[]> {
    const flattenedTasks = PlatformTools.mixedListToArray(this.options.tasks);
    const [classes, paths] = PlatformTools.splitClassesAndStrings(flattenedTasks);

    if (paths.length === 0) {
      return classes;
    }

    const discoveredFiles = this.fileDiscoveryService.discoverFiles(paths);
    const importedModules = await this.moduleImportService.importModules(discoveredFiles);
    const loadedClasses = this.fileClassLoaderService.loadClasses(importedModules);

    return [...classes, ...loadedClasses];
  }
}
