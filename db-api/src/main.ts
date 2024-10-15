import * as dotenv from 'dotenv';
import { join } from 'path';

try{
  const envPath = join(__dirname, '..', '.env');
  const result = dotenv.config({ path: envPath });
} catch (e) {
  console.log(e);
}

import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    cors: {
      origin: 'http://localhost:3000',
      credentials: true
    },
  });
  await app.listen(process.env.SERVER_PORT || 3002);
}
bootstrap();
