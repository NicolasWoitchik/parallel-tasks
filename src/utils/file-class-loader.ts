import { UnknownFunction } from '../commons/unkown-function'
import { PlatformTools } from '../tools'

/**
 * Service interface for extracting class constructors from imported modules.
 * 
 * Analyzes imported modules and extracts callable class constructors,
 * filtering out non-class exports and handling various module formats.
 * 
 * @internal
 * @interface IFileClassLoaderService
 */
export interface IFileClassLoaderService {
  /**
   * Extracts class constructors from an array of imported modules.
   * 
   * Iterates through module exports to identify and collect class constructors.
   * Handles default exports, named exports, and mixed module formats.
   * Non-class exports (functions, constants, etc.) are filtered out.
   * 
   * @param modules - Array of module objects from dynamic imports
   * @returns Array of class constructor functions ready for instantiation
   * 
   * @example
   * ```typescript
   * const service = new FileClassLoaderService();
   * const modules = [
   *   { default: UserValidationTask, EmailValidator: EmailValidator },
   *   { DataProcessor: DataProcessor, utils: { helper: () => {} } }
   * ];
   * 
   * const classes = service.loadClasses(modules);
   * // Returns: [UserValidationTask, EmailValidator, DataProcessor]
   * ```
   */
  loadClasses(modules: unknown[]): UnknownFunction[]
}

export class FileClassLoaderService implements IFileClassLoaderService {
  loadClasses(modules: unknown[]): UnknownFunction[] {
    return modules.reduce((allClasses: UnknownFunction[], module) => {
      const visited = new WeakSet()
      return this.extractClassesFromModule(module, allClasses, visited)
    }, [] as UnknownFunction[])
  }

  private extractClassesFromModule(exported: unknown, loadedClasses: UnknownFunction[], visited: WeakSet<object> = new WeakSet()): UnknownFunction[] {
    // Proteção contra referências circulares
    if (this.isObject(exported) && visited.has(exported)) {
      return loadedClasses
    }

    if (this.isFunction(exported)) {
      loadedClasses.push(exported as UnknownFunction)
    } else if (this.isArray(exported)) {
      if (this.isObject(exported)) visited.add(exported)
      exported.forEach(item => this.extractClassesFromModule(item, loadedClasses, visited))
    } else if (this.isObject(exported)) {
      visited.add(exported)
      Object.values(exported).forEach(value => 
        this.extractClassesFromModule(value, loadedClasses, visited)
      )
    }

    return loadedClasses
  }

  private isFunction(value: unknown): value is UnknownFunction {
    return typeof value === 'function'
  }

  private isArray(value: unknown): value is unknown[] {
    return Array.isArray(value)
  }

  private isObject(value: unknown): value is object {
    return PlatformTools.isObject(value)
  }
} 