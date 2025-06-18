import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Sale, SaleSchema } from './schemas/sales.schema';
import { SalesService } from './sales.service';
import { SalesController } from './sales.controller';
import { ProductsModule } from '../products/products.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Sale.name, schema: SaleSchema }]),
    ProductsModule,
    UsersModule,
  ],
  controllers: [SalesController],
  providers: [SalesService],
})
export class SalesModule {}
