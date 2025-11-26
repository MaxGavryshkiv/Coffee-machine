import {
  BadRequestException,
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Patch,
  Post,
} from '@nestjs/common';
import { ProductsService } from './products.service';
import { CreateProductDto } from './dto/create-product.dto';
import { Product } from './schemas/product.schema';
import { isValidObjectId } from 'mongoose';
import { UpdateProductDto } from './dto/update-product.dto';

@Controller('products')
export class ProductsController {
  constructor(private readonly productsService: ProductsService) {}

  @Post()
  create(@Body() dto: CreateProductDto) {
    return this.productsService.create(dto);
  }

  @Get()
  findAll() {
    return this.productsService.findAll();
  }

  @Get(':id')
  async getProductById(@Param('id') id: string): Promise<Product> {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Некоректний формат ID: ${id}`);
    }
    const product = await this.productsService.findById(id);
    if (!product) {
      throw new NotFoundException(`Продукт з ID ${id} не знайдено`);
    }
    return product;
  }

  @Patch(':id')
  async updateProduct(
    @Param('id') id: string,
    @Body() updateDto: UpdateProductDto,
  ) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Некоректний формат ID: ${id}`);
    }

    const updatedProduct = await this.productsService.update(id, updateDto);

    if (!updatedProduct) {
      throw new NotFoundException(`Продукт з ID ${id} не знайдено`);
    }

    return updatedProduct;
  }

  @Delete(':id')
  async deleteProduct(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException(`Некоректний формат ID: ${id}`);
    }

    const deletedProduct = await this.productsService.delete(id);

    if (!deletedProduct) {
      throw new NotFoundException(`Продукт з ID ${id} не знайдено`);
    }

    return {
      message: 'Продукт успішно видалено',
      deletedProduct,
    };
  }
}
