import { Model } from 'mongoose';
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Material } from './schemas/material.schema';
import { CreateMaterialDto } from './dto/create-material.dto';
import { UpdateMaterialDto } from './dto/update-material.dto';

@Injectable()
export class MaterialService {
  constructor(
    @InjectModel(Material.name) private materialModel: Model<Material>,
  ) {}

  async findAll(name?): Promise<Material[]> {
    if (name && name.trim() !== '') {
      return this.materialModel
        .find({ name: { $regex: name, $options: 'i' } })
        .exec();
    }
    return this.materialModel.find().exec();
  }

  async findById(id: string): Promise<Material> {
    const result = await this.materialModel.findById(id).exec();

    if (!result) throw new NotFoundException('Item With This Id Not Found');

    return result;
  }

  async create(createMaterialDto: CreateMaterialDto): Promise<Material> {
    const createMaterial = new this.materialModel(createMaterialDto);
    return createMaterial.save();
  }

  async update(
    id: string,
    updateMaterialDto: UpdateMaterialDto,
  ): Promise<Material> {
    const result = await this.materialModel
      .findByIdAndUpdate({ _id: id }, updateMaterialDto, { new: true })
      .exec();

    if (!result) throw new NotFoundException('Item With This Id Not Found');

    return result;
  }

  async delete(id: string): Promise<Material> {
    const result = await this.materialModel.findByIdAndDelete(id).exec();

    if (!result) throw new NotFoundException('Item With This Id Not Found');

    return result;
  }
}
