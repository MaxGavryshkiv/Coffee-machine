import { Injectable, ConflictException } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import * as bcrypt from 'bcrypt';

import { User, UserDocument } from './schemas/user.schema';
import { CreateUserDto } from './dto/create-user.dto';

@Injectable()
export class UsersService {
  constructor(@InjectModel(User.name) private userModel: Model<UserDocument>) {}

  async create(createUserDto: CreateUserDto): Promise<User> {
    const existingUser = await this.userModel.findOne({
      email: createUserDto.email,
    });
    if (existingUser) {
      throw new ConflictException('Користувач з такою поштою вже існує');
    }

    const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
    const createdUser = new this.userModel({
      ...createUserDto,
      password: hashedPassword,
    });

    return createdUser.save();
  }

  async findAll(): Promise<User[]> {
    return this.userModel.find().exec();
  }

  async findOne(id: string): Promise<User | null> {
    return this.userModel.findById(id).exec();
  }

  async findByEmail(email: string) {
    return this.userModel.findOne({ email });
  }

  async update(
    id: string,
    updateData: Partial<CreateUserDto>,
  ): Promise<User | null> {
    // Перевірка унікальності email
    if (updateData.email) {
      const existingUser = await this.userModel.findOne({
        email: updateData.email,
      });
      if (existingUser && existingUser._id.toString() !== id) {
        throw new ConflictException('Користувач з такою поштою вже існує');
      }
    }

    // Хешування пароля, якщо він оновлюється
    if (updateData.password) {
      updateData.password = await bcrypt.hash(updateData.password, 10);
    }

    return this.userModel
      .findByIdAndUpdate(id, updateData, { new: true })
      .exec();
  }

  async remove(id: string): Promise<User | null> {
    return this.userModel.findByIdAndDelete(id).exec();
  }
}
