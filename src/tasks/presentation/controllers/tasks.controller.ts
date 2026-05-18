import { Controller, Post, Get, Body } from '@nestjs/common';
import { CreateTaskUseCase } from '../../application/use-cases/create-task.use-case';
import { GetTasksUseCase } from '../../application/use-cases/get-tasks.use-case';
import { CreateTaskDto } from '../dto/create-task.dto';
import { Task } from '../../domain/entities/task.entity';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';

@ApiTags('Tasks')
@Controller('tasks')
export class TasksController {
  constructor(
    private readonly createTaskUseCase: CreateTaskUseCase,
    private readonly getTasksUseCase: GetTasksUseCase,
  ) {}

  @Post()
  @ApiOperation({
    summary: 'Yeni bir arka plan görevi oluşturur',
    description: 'Verilen başlık ile yeni bir görev kaydeder ve işlenmek üzere BullMQ kuyruğuna aktarır.',
  })
  @ApiResponse({
    status: 201,
    description: 'Görev başarıyla oluşturuldu ve kuyruğa eklendi.',
    type: Task,
  })
  @ApiResponse({
    status: 400,
    description: 'Geçersiz girdi (Validation hatası).',
  })
  async createTask(@Body() createTaskDto: CreateTaskDto): Promise<Task> {
    return this.createTaskUseCase.execute(createTaskDto.title);
  }

  @Get()
  @ApiOperation({
    summary: 'Tüm görevleri listeler',
    description: 'Veritabanında kayıtlı olan tüm görevleri oluşturulma sırasına göre listeler.',
  })
  @ApiResponse({
    status: 200,
    description: 'Görev listesi başarıyla getirildi.',
    type: [Task],
  })
  async getTasks(): Promise<Task[]> {
    return this.getTasksUseCase.execute();
  }
}

