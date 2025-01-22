import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { MaterialController } from './material.controller';
import { MaterialService } from './material.service';

@Module({
  imports: [
    MongooseModule.forFeature([
      // { name: Location.name, schema: LocationSchema },
    ]),
  ],
  controllers: [MaterialController],
  providers: [MaterialService],
})
export class MaterialModule {}
