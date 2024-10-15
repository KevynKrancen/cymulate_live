import { Controller, Get, Post, Body, Patch, Param, Delete, Logger, UnauthorizedException, Headers } from '@nestjs/common';
import { TasksService } from './tasks.service';
import { CreateTaskDto } from './dto/create-tasks.dto';
import { User } from '../users/schemas/user.schema';

@Controller('tasks')
export class TasksController {
  private readonly logger = new Logger(TasksController.name);
  constructor(private readonly tasksService: TasksService) {}

  @Post()
    async create(@Body() createTaskDto: CreateTaskDto) {
    const task = await this.tasksService.create(createTaskDto);
    await this.tasksService.sendRequest(task);
    return task;
  }

  @Post('create-task')
  async createone(@Body() createTaskDto: CreateTaskDto) {
    const task = await this.tasksService.create(createTaskDto);
    await this.tasksService.sendRequest(task);
    return task;
  }

  @Get()
  findAll() {
    return this.tasksService.findAll();
  }

  @Get('all-user-tasks/:id')
  async findAllFromUser(@Param('id') id: string) {
    this.logger.log(`Received request for tasks of user: ${id}`);
    try {
      const tasks = await this.tasksService.findAllTasksFromUser(id);
      this.logger.log(`Found ${tasks.length} tasks for user: ${id}`);
      return tasks;
    } catch (error) {
      this.logger.error(`Error fetching tasks for user ${id}: ${error.message}`);
      throw error;
    }
  }

  @Get('collect-data/:id')
  async collectData(@Param('id') id: string) {
    this.logger.log(`Received request to collect data for task: ${id}`);
    return this.tasksService.collectData(id);
  }



  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.tasksService.findOne(+id); 
  }

 
  @Delete(':id')
  remove(@Param('id') id: string) {
    return this.tasksService.remove(+id);
  }
}
