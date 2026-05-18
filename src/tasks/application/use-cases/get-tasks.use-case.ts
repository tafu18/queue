import { Inject, Injectable } from '@nestjs/common';
import { ITasksRepository, ITasksRepositoryToken } from '../../domain/interfaces/tasks-repository.interface';
import { Task } from '../../domain/entities/task.entity';

@Injectable()
export class GetTasksUseCase {
  constructor(
    @Inject(ITasksRepositoryToken)
    private readonly taskRepository: ITasksRepository,
  ) {}

  async execute(): Promise<Task[]> {
    return this.taskRepository.findAll();
  }
}
