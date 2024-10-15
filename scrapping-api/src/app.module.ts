import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MongooseModule } from '@nestjs/mongoose';
import { ScrappingModule } from './scrapping/scrapping.module';


@Module({
  imports: [
    MongooseModule.forRoot(process.env.DB_CONNEXION_STRING),
    ScrappingModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
