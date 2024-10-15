import {
  Controller,
  Body,
} from '@nestjs/common';
import { ScrappingService } from './scrapping.service';
import { TaskDto } from './dto/update-scrapper.dto';
import { MessagePattern } from '@nestjs/microservices';
import { CheerioScrapperService } from './cheerio-scrapper.service';

@Controller('scrapper')
export class ScrappingController {
  constructor(private scrappingService: CheerioScrapperService) {}

  @MessagePattern('start-task')
  async RunTask(@Body() task: TaskDto) {
    try {
      return await this.scrappingService.startTask(task);
    } catch (error) {
      throw error;
    }
  }
}