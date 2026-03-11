import { Controller, Get, Post, Body, Param, Req } from '@nestjs/common';
import { LocationService } from './location.service';
import { CreateLocationDto } from './dto/create-location.dto';
import { AssignUserLocationDto } from './dto/assign-user-location.dto';
import { SelectLocationDto } from './dto/select-location.dto';
import { Request } from 'express';

@Controller('locations')
export class LocationController {
  constructor(private readonly locationService: LocationService) {}

  @Get('assigned')
  getAssignedLocations(@Req() req: Request) {
    const userId = req.user['sub'];
    return this.locationService.getUserLocations(userId);
  }

  @Get(':tenantId')
  getLocations(@Param('tenantId') tenantId: string) {
    return this.locationService.getLocationsByTenant(tenantId);
  }

  @Post()
  createLocation(@Body() dto: CreateLocationDto) {
    const { tenantId, name, address, photoUrl } = dto;
    return this.locationService.createLocation(
      tenantId,
      name,
      address,
      photoUrl,
    );
  }

  @Post('select')
  selectLocation(@Req() req: Request, @Body() dto: SelectLocationDto) {
    const userId = req.user['sub'];
    return this.locationService.selectActiveLocation(userId, dto.locationId);
  }

  @Post('assign')
  assignUser(@Body() dto: AssignUserLocationDto) {
    const { userId, locationId } = dto;
    return this.locationService.assignUserToLocation(userId, locationId);
  }
}
