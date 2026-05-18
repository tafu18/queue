import { Inject, Injectable } from '@nestjs/common';
import { ITasksRepository, ITasksRepositoryToken } from '../../domain/interfaces/tasks-repository.interface';
import { ITasksQueue, ITasksQueueToken } from '../../domain/interfaces/tasks-queue.interface';
import { Task } from '../../domain/entities/task.entity';

@Injectable()
export class CreateTaskUseCase {
  constructor(
    @Inject(ITasksRepositoryToken)
    private readonly taskRepository: ITasksRepository,
    @Inject(ITasksQueueToken)
    private readonly taskQueue: ITasksQueue,
  ) { }

  async execute(title: string): Promise<Task> {
    // 1. Persist the task entity using our repository interface

    let savedTask: Task;
    for (let i = 0; i <= 100; i++) {
      const task = await this.taskRepository.create({ title: `${title}${i}` });
      savedTask = await this.taskRepository.save(task);

      // 2. Dispatch a background processing job using our queue interface
      await this.taskQueue.enqueueTaskProcess(savedTask.id, savedTask.title);
    }

    return savedTask;
  }
}
