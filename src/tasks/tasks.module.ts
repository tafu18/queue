import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { BullModule } from '@nestjs/bullmq';

// Domain Imports
import { Task } from './domain/entities/task.entity';
import { ITasksRepositoryToken } from './domain/interfaces/tasks-repository.interface';
import { ITasksQueueToken } from './domain/interfaces/tasks-queue.interface';

// Application Imports
import { CreateTaskUseCase } from './application/use-cases/create-task.use-case';
import { GetTasksUseCase } from './application/use-cases/get-tasks.use-case';

// Infrastructure Imports
import { TypeOrmTasksRepository } from './infrastructure/repositories/typeorm-tasks.repository';
import { BullMQTasksQueue } from './infrastructure/queue/bullmq-tasks.queue';
import { TasksProcessor } from './infrastructure/queue/tasks.processor';

// Presentation Imports
import { TasksController } from './presentation/controllers/tasks.controller';

@Module({
  imports: [
    // Register the database entity in TypeORM
    TypeOrmModule.forFeature([Task]),

    // Register the Redis queue in BullMQ
    BullModule.registerQueue({
      name: 'task_queue',
    }),
  ],
  controllers: [TasksController],
  providers: [
    // Bind Repository Interface to TypeORM Concrete Implementation
    {
      provide: ITasksRepositoryToken,
      useClass: TypeOrmTasksRepository,
    },
    // Bind Queue Interface to BullMQ Concrete Implementation
    {
      provide: ITasksQueueToken,
      useClass: BullMQTasksQueue,
    },
    // Application Use Cases
    CreateTaskUseCase,
    GetTasksUseCase,
    // Queue Worker / Processor
    TasksProcessor,
  ],
  exports: [CreateTaskUseCase, GetTasksUseCase],
})
export class TasksModule {}
