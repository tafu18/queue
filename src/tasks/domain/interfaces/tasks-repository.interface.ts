import { Task } from '../entities/task.entity';

export interface ITasksRepository {
  create(task: Partial<Task>): Promise<Task>;
  save(task: Task): Promise<Task>;
  findAll(): Promise<Task[]>;
  findById(id: number): Promise<Task | null>;
}

export const ITasksRepositoryToken = Symbol('ITasksRepository');
