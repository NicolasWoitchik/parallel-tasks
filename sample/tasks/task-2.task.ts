import { RegisterTask } from '../../src'
import { TaskExampleRequestDTO, TaskExampleResponseDTO } from '../dtos/task-example.dto'
import { TaskType } from '../enums'

export class Task2 {

  @RegisterTask(TaskType.EXAMPLE)
  async run(payload: TaskExampleRequestDTO): Promise<TaskExampleResponseDTO> {
    console.log('Running example task2...', payload)

    await new Promise((resolve) => setTimeout(resolve, 2000))

    throw new Error('Error in task2')

  }
}