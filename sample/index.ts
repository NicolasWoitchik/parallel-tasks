import path from 'path';
import { ParallelTasks } from '../src/parallel-tasks';
import { Runner } from './runner';

export async function main() {
  const parallelTasks = new ParallelTasks({
    tasks: [
      path.resolve(__dirname, './tasks/**.task.ts')
    ],
  });
  await parallelTasks.initialize();
  
  const runner = new Runner(parallelTasks);

  const result = await runner.execute();

  console.log(result);
}

main();