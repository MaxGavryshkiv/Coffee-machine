import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Patch,
  Post,
  Query,
  ValidationPipe,
} from '@nestjs/common';

@Controller('material')
export class MaterialController {
  @Get()
  findAll(@Query('name') name?: string) {
    return 'This action returns all material';
  }

  @Get(':id')
  findById(@Param('id') id: string) {
    return `This action returns a id #${id} material`;
  }

  @Post()
  create(@Body() material: {}) {
    return material;
  }

  @Patch(':id')
  update(@Param('id') id: string, @Body() materialUpdate: {}) {
    return { id, ...materialUpdate };
  }

  @Delete(':id')
  remove(@Param('id') id: string) {
    return `This action removes a #${id} material`;
  }
}
