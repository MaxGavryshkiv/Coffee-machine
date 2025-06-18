import {
  Controller,
  Post,
  Get,
  Body,
  UseGuards,
  Request,
  ForbiddenException,
} from '@nestjs/common';
import { SalesService } from './sales.service';
import { CreateSaleDto } from './dto/create-sale.dto';
import { AuthGuard } from '@nestjs/passport';
import { Roles } from '../auth/roles.decorator';
import { RolesGuard } from '../auth/roles.guard';
import { PermissionsGuard } from '../auth/permissions.guard';
import { Permissions } from '../auth/permissions.decorator';

@Controller('sales')
@UseGuards(AuthGuard('jwt'), RolesGuard, PermissionsGuard)
export class SalesController {
  constructor(private readonly salesService: SalesService) {}

  @Post()
  @Roles('seller', 'manager', 'owner')
  @Permissions('create-sales') // можеш або видалити, або залишити
  async create(@Body() dto: CreateSaleDto, @Request() req) {
    if (!req.user || !req.user._id) {
      throw new ForbiddenException('Unauthorized user');
    }

    const sale = await this.salesService.createSale({
      ...dto,
      seller: req.user._id,
    });

    return sale;
  }

  @Get()
  @Roles('manager', 'owner') // тільки менеджер або власник можуть переглядати всі продажі
  async findAll() {
    return this.salesService.findAll();
  }
}
