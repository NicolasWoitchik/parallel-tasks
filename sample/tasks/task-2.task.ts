import { RegisterTask } from '../../src';
import { TaskType } from '../enums';
import { TaskExampleRequestDTO, TaskExampleResponseDTO } from '../dtos/task-example.dto';

export class Task2 {
  
  @RegisterTask(TaskType.EXAMPLE)
  async run(payload: TaskExampleRequestDTO): Promise<TaskExampleResponseDTO> {
    console.log('Running example task2...', payload);

    await new Promise((resolve) => setTimeout(resolve, 1200));
    
    throw new Error('Error in task2');

  }
}