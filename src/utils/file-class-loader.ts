import { PlatformTools } from '../tools';

export interface IFileClassLoaderService {
  loadClasses(modules: any[]): Function[];
}

export class FileClassLoaderService implements IFileClassLoaderService {
  loadClasses(modules: any[]): Function[] {
    return modules.reduce((allClasses, module) => {
      return this.extractClassesFromModule(module, allClasses);
    }, [] as Function[]);
  }

  private extractClassesFromModule(exported: any, loadedClasses: Function[]): Function[] {
    if (this.isFunction(exported)) {
      loadedClasses.push(exported);
    } else if (this.isArray(exported)) {
      exported.forEach(item => this.extractClassesFromModule(item, loadedClasses));
    } else if (this.isObject(exported)) {
      Object.values(exported).forEach(value => 
        this.extractClassesFromModule(value, loadedClasses)
      );
    }

    return loadedClasses;
  }

  private isFunction(value: any): value is Function {
    return typeof value === "function";
  }

  private isArray(value: any): value is any[] {
    return Array.isArray(value);
  }

  private isObject(value: any): value is object {
    return PlatformTools.isObject(value);
  }
} 