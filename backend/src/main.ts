import { Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const config = app.get(ConfigService);

  app.enableCors({ origin: config.get<string>('cors.origin') });
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = config.get<number>('port')!;
  await app.listen(port);
  Logger.log(`Backend listening on http://localhost:${port}`, 'Bootstrap');
}

bootstrap();
