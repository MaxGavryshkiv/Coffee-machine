import { Injectable } from '@nestjs/common';
import { Sale } from './schemas/sales.schema';
import { CreateSaleDto } from './dto/create-sale.dto';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';

@Injectable()
export class SalesService {
  constructor(@InjectModel(Sale.name) private saleModel: Model<Sale>) {}

  async createSale(saleData: CreateSaleDto): Promise<Sale> {
    const total = saleData.items.reduce(
      (acc, item) => acc + item.quantity * item.pricePerUnit,
      0,
    );

    const sale = new this.saleModel({ ...saleData, totalAmount: total });
    return sale.save();
  }

  async findAll(): Promise<Sale[]> {
    return this.saleModel.find().populate('seller').populate('items.product');
  }

  // додаткові методи: пошук по даті, продавцю, товару тощо
}
