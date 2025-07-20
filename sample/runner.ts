import { IParallelTasks } from '../src'
import { TaskType } from './enums'

export class Runner {
  constructor(
    private readonly parallelTasks: IParallelTasks
  ){}

  async execute() {
    const result = await this.parallelTasks.execute(TaskType.EXAMPLE, {
      pixKey: '1234567890',
      amount: 100,
    })

    return result
  }
}