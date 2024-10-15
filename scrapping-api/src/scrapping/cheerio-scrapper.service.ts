import { Injectable } from "@nestjs/common";
import { Model } from "mongoose";
import { Task } from "src/tasks/schemas/tasks.schema";
import { ScrappedData, ScrappedDataDocument } from "./schemas/scrapping.schema";
import { InjectModel } from "@nestjs/mongoose";
import { ScrappingService } from "./scrapping.service";
import { html } from "cheerio/dist/commonjs/api/manipulation";
import * as cheerio from 'cheerio';
import axios from "axios";



@Injectable()
export class CheerioScrapperService extends ScrappingService{
    async getScrappedData(urlToScrape: string): Promise<Set<string>> {
       const { data: html } = await axios.get(urlToScrape);
        const $ = cheerio.load(html);
        const links: Set<string> = new Set();   
    
        $('a').each((index, element) => {
        const href = $(element).attr('href');
        if (href && href.startsWith('https://')) {
          links.add(href);
        }
      });
      return links;
    }
    
    constructor(
        @InjectModel(ScrappedData.name) 
        scrappedDataModel: Model<ScrappedDataDocument>,    
        @InjectModel(Task.name) taskModel: Model<Task>,
    ) {
        super(scrappedDataModel, taskModel);
    }

}