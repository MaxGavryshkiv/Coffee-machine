import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { MaterialModule } from './material/material.module';

@Module({
  imports: [
    MongooseModule.forRoot('mongodb://localhost:27017/coffee_db'),
    MaterialModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
