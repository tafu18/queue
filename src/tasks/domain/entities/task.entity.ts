import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';
import { ApiProperty } from '@nestjs/swagger';

@Entity('tasks')
export class Task {
  @ApiProperty({ description: 'Görevin benzersiz kimliği (ID)', example: 1 })
  @PrimaryGeneratedColumn()
  id: number;

  @ApiProperty({ description: 'Görevin başlığı', example: 'Büyük Veri Analizi Raporu' })
  @Column()
  title: string;

  @ApiProperty({ description: 'Görevin güncel işlenme durumu', example: 'PENDING', default: 'PENDING' })
  @Column({ default: 'PENDING' })
  status: string;

  @ApiProperty({ description: 'Görevin oluşturulma tarihi', example: '2026-05-19T00:00:00.000Z' })
  @CreateDateColumn()
  createdAt: Date;
}
