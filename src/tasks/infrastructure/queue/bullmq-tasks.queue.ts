import { Injectable } from '@nestjs/common';
import { InjectQueue } from '@nestjs/bullmq';
import { Queue } from 'bullmq';
import { ITasksQueue } from '../../domain/interfaces/tasks-queue.interface';

@Injectable()
export class BullMQTasksQueue implements ITasksQueue {
  constructor(
    @InjectQueue('task_queue')
    private readonly queue: Queue,
  ) {}

  async enqueueTaskProcess(taskId: number, title: string): Promise<void> {
    await this.queue.add('process_task', {
      taskId,
      title,
    }, {delay: 2000});
  }
}
