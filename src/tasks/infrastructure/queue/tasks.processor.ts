import { Processor, WorkerHost } from '@nestjs/bullmq';
import { Job } from 'bullmq';
import { Inject, Logger } from '@nestjs/common';
import { ITasksRepository, ITasksRepositoryToken } from '../../domain/interfaces/tasks-repository.interface';

@Processor('task_queue', { concurrency: 10})
export class TasksProcessor extends WorkerHost {
  private readonly logger = new Logger(TasksProcessor.name);

  constructor(
    @Inject(ITasksRepositoryToken)
    private readonly taskRepository: ITasksRepository,
  ) {
    super();
  }

  async process(job: Job<any, any, string>): Promise<any> {
    this.logger.log(`[BullMQ Worker] Processing job ${job.id} for Task ID ${job.data.taskId}...`);

    // Simulate heavy business logic / long task
    await new Promise((resolve) => setTimeout(resolve, 5000));

    // Update the task status using our repository contract
    const task = await this.taskRepository.findById(job.data.taskId);

    if (task) {
      task.status = 'COMPLETED';
      await this.taskRepository.save(task);
      this.logger.log(`[BullMQ Worker] Task ${job.data.taskId} processed successfully and marked as COMPLETED.`);
    } else {
      this.logger.error(`[BullMQ Worker] Task with ID ${job.data.taskId} not found!`);
    }

    return { success: true };
  }
}

