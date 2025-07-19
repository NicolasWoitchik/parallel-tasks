import { MixedList } from "../commons/mixed-list";

/**
 * Configuration options for the ParallelTasks framework.
 * 
 * @public
 * @interface IParallelTasksOptions
 * 
 * @example
 * ```typescript
 * const options: IParallelTasksOptions = {
 *   tasks: [
 *     MyTaskClass,
 *     './tasks/**\/*.task.ts',
 *     './validators/**\/*.validator.ts'
 *   ]
 * };
 * ```
 */
export interface IParallelTasksOptions {
  /**
   * Array of task classes and/or glob patterns for task discovery.
   * 
   * Can contain:
   * - Direct class references for immediate registration
   * - Glob patterns for automatic file discovery and loading
   * - Mix of both types for flexible task management
   * 
   * @remarks
   * When using glob patterns, files are loaded dynamically using dynamic imports.
   * Ensure your task classes are exported and decorated with @RegisterTask.
   * 
   * @example
   * ```typescript
   * // Direct class references
   * tasks: [UserValidationTasks, DataProcessingTasks]
   * 
   * // Glob patterns
   * tasks: ['./src/tasks/**\/*.task.ts']
   * 
   * // Mixed approach
   * tasks: [
   *   MyImportantTask,
   *   './src/tasks/**\/*.task.ts',
   *   './src/validators/**\/*.validator.ts'
   * ]
   * ```
   */
  tasks?: MixedList<Function | string>;
}