import { Module } from '@nestjs/common';
import { ScrappingController } from './scrapping.controller';         
import { MongooseModule } from '@nestjs/mongoose';  
import { ScrappedData, ScrappedDataSchema } from './schemas/scrapping.schema';
import { Task, TaskSchema } from 'src/tasks/schemas/tasks.schema';
import { CheerioScrapperService } from './cheerio-scrapper.service';


@Module({
  controllers: [ScrappingController],
  providers: [CheerioScrapperService],
  exports: [CheerioScrapperService],
  imports: [
    MongooseModule.forFeature([{ name: ScrappedData.name, schema: ScrappedDataSchema },
    { name: Task.name, schema: TaskSchema }]),  
  ],
})
export class ScrappingModule {}
