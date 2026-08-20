import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Task } from './entities/task.entity';

@Injectable()
export class TasksService {
  constructor(
    @InjectRepository(Task)
    private readonly taskRepository: Repository<Task>,
  ) {}

  async findAll() {
    return this.taskRepository.find();
  }

  async findOne(id: number) {
    return this.taskRepository.findOneBy({ id });
  }

  async create(title: string, priority: string, status: string) {
    const task = this.taskRepository.create({
      title,
      priority,
      status,
    });

    return this.taskRepository.save(task);
  }

  async remove(id: number) {
    return this.taskRepository.delete(id);
  }
}
