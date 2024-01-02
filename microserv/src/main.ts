import { NestFactory } from '@nestjs/core';
import { IoAdapter } from '@nestjs/platform-socket.io';
import * as socketio from 'socket.io';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const httpServer = app.getHttpServer();
  
  const io = new socketio.Server(httpServer, {
    cors: {
      origin: "*",
     credentials:true
    },
  });

  app.useWebSocketAdapter(new IoAdapter(io));
  
  await app.listen(3001);
}
bootstrap();
