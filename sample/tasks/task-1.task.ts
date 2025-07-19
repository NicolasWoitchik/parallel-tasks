import { RegisterTask } from '../../src';
import { TaskType } from '../enums';
import { TaskExampleRequestDTO, TaskExampleResponseDTO } from '../dtos/task-example.dto';

export class Task1 {
  
  @RegisterTask(TaskType.EXAMPLE)
  async run(payload: TaskExampleRequestDTO): Promise<TaskExampleResponseDTO> {
    console.log('Running example task1...', payload);

    await new Promise((resolve) => setTimeout(resolve, 1000));
    console.log('Example task1 finished', payload);

    return {
      message: 'Example task1 finished',
    };
  }
}