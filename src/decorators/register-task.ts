import { getMetadataArgsStorage } from "../globals";
import { TasksValueMetadataArgs } from "../interfaces/tasksValueMetadataArgs";

/**
 * Register a task to be executed in parallel
 * @param taskName - The name of task to register
 * @returns A decorator function that can be used to register a task
 */
export function RegisterTask(taskName: string): PropertyDecorator {
  return function (target: Object, propertyKey: string | symbol) {
    getMetadataArgsStorage().tasks.push({
      taskName: taskName,
      target: target[propertyKey],
    } as TasksValueMetadataArgs);
  };
}