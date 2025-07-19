import { IParallelTasks } from "../src";

export class Runner {
  constructor(
    private readonly parallelTasks: IParallelTasks
  ){}

  async execute() {
    const result = await this.parallelTasks.execute('TESTE', {
      pixKey: '1234567890',
      amount: 100,
    });

    return result;
  }
}