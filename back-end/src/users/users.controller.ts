import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Delete,
  Put,
  NotFoundException,
  BadRequestException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { isValidObjectId } from 'mongoose';
import { UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { Permissions } from '../auth/permissions.decorator';
import { PermissionsGuard } from '../auth/permissions.guard';

@UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
@Permissions('edit-users')
@Roles('owner') // лише адміну
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Get()
  async findAll() {
    return this.usersService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const user = await this.usersService.findOne(id);
    if (!user) {
      throw new NotFoundException('User not found');
    }

    return user;
  }

  @Put(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUserDto: Partial<CreateUserDto>,
  ) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const updated = await this.usersService.update(id, updateUserDto);
    if (!updated) {
      throw new NotFoundException('User not found');
    }

    return updated;
  }

  @Delete(':id')
  async remove(@Param('id') id: string) {
    if (!isValidObjectId(id)) {
      throw new BadRequestException('Invalid user ID format');
    }

    const deleted = await this.usersService.remove(id);
    if (!deleted) {
      throw new NotFoundException('User not found');
    }

    return deleted;
  }
}
