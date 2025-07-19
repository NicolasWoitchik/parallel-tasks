/**
 * Flexible type representing a list of items that can be provided as either:
 * - A standard array of type T
 * - An object map where values are of type T
 * 
 * This pattern is commonly used for entities and configurations where items
 * can be imported in different ways (direct imports vs. import * as syntax).
 * 
 * @template T - The type of items contained in the list
 * 
 * @public
 * @typedef MixedList
 * 
 * @example
 * ```typescript
 * // Array format
 * const tasks: MixedList<Function> = [
 *   UserValidationTask,
 *   DataProcessingTask,
 *   EmailNotificationTask
 * ];
 * 
 * // Object map format (useful with import * as syntax)
 * import * as allTasks from './tasks';
 * const tasks: MixedList<Function> = allTasks;
 * // Where allTasks = { UserValidationTask, DataProcessingTask, ... }
 * 
 * // Mixed with strings (for file paths)
 * const mixedTasks: MixedList<Function | string> = [
 *   UserValidationTask, // Direct class reference
 *   './tasks/**\/*.task.ts' // Glob pattern
 * ];
 * ```
 * 
 * @remarks
 * The framework automatically handles both formats using PlatformTools.mixedListToArray()
 * to normalize the input into a consistent array format for processing.
 */
export type MixedList<T> = T[] | { [key: string]: T }