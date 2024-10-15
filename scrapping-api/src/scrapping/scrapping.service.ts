import { Injectable } from '@nestjs/common';
import { Model } from 'mongoose';
import { TaskDto } from './dto/update-scrapper.dto';
import { InjectModel } from '@nestjs/mongoose';
import { ScrappedData, ScrappedDataDocument } from './schemas/scrapping.schema';
import axios from 'axios';
import * as cheerio from 'cheerio';
import { v4 as uuidv4 } from 'uuid';
import { Task } from 'src/tasks/schemas/tasks.schema';

export abstract class ScrappingService {
  constructor(
    protected readonly scrappedDataModel: Model<ScrappedDataDocument>,
    protected readonly taskModel: Model<Task>,

  ) {}

  async startTask({token}: TaskDto): Promise<ScrappedData> {
    const task = await this.taskModel.findOne({ token }).lean();
    if(!task) throw new Error("task not found");

    try {
      const links = await this.getScrappedData(task.urlToScrape);
  
      const scrappedData = new this.scrappedDataModel({
        token: task.token,
        scrappedData: [...links] ,
      });

      await this.taskModel.findOneAndUpdate({ token: task.token }, { status: 'completed' as any  });
      return await scrappedData.save();
    } catch (error) {
      console.error('Error during scraping:', error);
      throw new Error('Failed to scrape the URL.');
    }
  }

  abstract getScrappedData(token: string): Promise<Set<string>> ;

}