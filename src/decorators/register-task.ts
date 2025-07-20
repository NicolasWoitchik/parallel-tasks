import { getMetadataArgsStorage } from '../globals'
import { TasksValueMetadataArgs } from '../interfaces/tasksValueMetadataArgs'

/**
 * Register a task to be executed in parallel
 * @param taskName - The name of task to register
 * @returns A decorator function that can be used to register a task
 */
export function RegisterTask(taskName: string): MethodDecorator {
  return function (target: object, propertyKey: string | symbol, descriptor?: PropertyDescriptor) {
    getMetadataArgsStorage().tasks.push({
      taskName: taskName,
      target: descriptor?.value,
    } as TasksValueMetadataArgs)
  }
}