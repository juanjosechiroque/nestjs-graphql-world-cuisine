/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { HasRoles } from '../user/roles.decorator';
import { Role } from '../user/role.enum';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CiudadDto } from './ciudad.dto';
import { CiudadEntity } from './ciudad.entity';
import { CiudadService } from './ciudad.service';

@Controller('ciudades')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadController {
    constructor(private readonly ciudadService: CiudadService) {}

  @Get()
  @HasRoles(Role.ADMIN,Role.READER)
  async findAll() {
    return await this.ciudadService.findAll();
  }

  @Get(':ciudadCodigo')
  @HasRoles(Role.ADMIN,Role.READER)
  async findOne(@Param('ciudadCodigo') ciudadCodigo: string) {
    return await this.ciudadService.findOne(ciudadCodigo);
  }

  @Post()
  @HasRoles(Role.ADMIN)
  async create(@Body() ciudadDto: CiudadDto) {
    const ciudad: CiudadEntity = plainToInstance(CiudadEntity, ciudadDto);
    return await this.ciudadService.create(ciudad);
  }

  @Put(':ciudadCodigo')
  @HasRoles(Role.ADMIN)
  async update(@Param('ciudadCodigo') ciudadCodigo: string, @Body() ciudadDto: CiudadDto) {
    const ciudad: CiudadEntity = plainToInstance(CiudadEntity, ciudadDto);
    return await this.ciudadService.update(ciudadCodigo, ciudad);
  }

  @Delete(':ciudadCodigo')
  @HttpCode(204)
  @HasRoles(Role.ADMIN)
  async delete(@Param('ciudadCodigo') ciudadCodigo: string) {
    return await this.ciudadService.delete(ciudadCodigo);
  }

}
