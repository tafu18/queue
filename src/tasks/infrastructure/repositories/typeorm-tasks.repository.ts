import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from '../../domain/entities/task.entity';
import { ITasksRepository } from '../../domain/interfaces/tasks-repository.interface';

@Injectable()
export class TypeOrmTasksRepository implements ITasksRepository {
  constructor(
    @InjectRepository(Task)
    private readonly repository: Repository<Task>,
  ) {}

  async create(task: Partial<Task>): Promise<Task> {
    return this.repository.create(task);
  }

  async save(task: Task): Promise<Task> {
    return this.repository.save(task);
  }

  async findAll(): Promise<Task[]> {
    return this.repository.find({
      order: {
        createdAt: 'DESC',
      },
    });
  }

  async findById(id: number): Promise<Task | null> {
    return this.repository.findOne({
      where: { id },
    });
  }
}
