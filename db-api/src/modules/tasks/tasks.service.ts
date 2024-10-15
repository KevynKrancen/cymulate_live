import { Inject, Injectable, NotFoundException } from '@nestjs/common';
import { CreateTaskDto } from './dto/create-tasks.dto';
import { Task } from './schemas/tasks.schema';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { firstValueFrom } from 'rxjs';
import { ClientProxy } from '@nestjs/microservices';
import { ScrappedData } from '../scrapping/schemas/scrapping.schema';
import { TaskStatus } from './schemas/tasks.schema';

@Injectable()
export class TasksService {
  constructor(
    @Inject('scrappingApi') private client: ClientProxy,
    @InjectModel(Task.name) private readonly taskModel: Model<Task>,
    @InjectModel(ScrappedData.name) private readonly scrappedDataModel: Model<ScrappedData>,
  ) {}

  async create(createTaskDto: CreateTaskDto): Promise<Task> {
    const createdTask = new this.taskModel(createTaskDto);
    return createdTask.save();
  }

  async sendRequest(task: Task): Promise<Task> {
    try {
      const {token} = task;
      await firstValueFrom(
        this.client.emit<number>('start-task', {token})
      );
      return task;
    } catch (error) {
      if (task.token) {
        task.status = TaskStatus.FAILED;
        await this.taskModel.findOneAndUpdate({ token: task.token }, { status: TaskStatus.FAILED });
      }

      console.log(error);
      throw error;
    }
  }

  async findAllTasksFromUser(userId: string): Promise<Task[]> {
    const tokenPrefix = `^${userId}`;
    const regex = new RegExp(tokenPrefix, 'i');
    const tasks = await this.taskModel.find({ token: { $regex: regex } }).exec();
    return tasks;
  }

  async collectData(id: string): Promise<ScrappedData> {
    const task = await this.taskModel.findById(id).exec();
    if (!task) {
      throw new NotFoundException(`Task with ID "${id}" not found`);
    }

    const scrappedData = await this.scrappedDataModel.findOne({ token: task.token }).exec();
    if (!scrappedData) {
      throw new NotFoundException(`Scrapped data with token "${task.token}" not found`);
    }
    console.log(scrappedData)
    return scrappedData;
  }

  findAll() {
    return `This action returns all tasks`;
  }

  findOne(id: number) {
    return `This action returns a #${id} task`;
  }

  remove(id: number) {
    return `This action removes a #${id} task`;
  }
}