import * as dotenv from 'dotenv';
import { join } from 'path';

const envPath = join(__dirname, '..', '.env');
const result = dotenv.config({ path: envPath });

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { MicroserviceOptions, Transport } from '@nestjs/microservices';

async function bootstrap() {
  const app = await NestFactory.createMicroservice<MicroserviceOptions>(AppModule, {
    transport: Transport.RMQ,
    options: {
      urls: [process.env.RABBITMQ_URL || 'amqp://localhost:5672'],
      queue: 'scrapping-api',
      queueOptions: {
        durable: false
      },
    },
  })
  await app.listen()
  
  // await app.listen(process.env.SERVER_PORT || z);
}
bootstrap();
