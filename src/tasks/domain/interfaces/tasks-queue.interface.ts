export interface ITasksQueue {
  enqueueTaskProcess(taskId: number, title: string): Promise<void>;
}

export const ITasksQueueToken = Symbol('ITasksQueue');
