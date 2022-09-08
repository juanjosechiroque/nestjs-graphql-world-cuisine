/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CiudadDto } from './ciudad.dto';
import { CiudadEntity } from './ciudad.entity';
import { CiudadService } from './ciudad.service';

@Controller('ciudades')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadController {
    constructor(private readonly ciudadService: CiudadService) {}

  @Get()
  async findAll() {
    return await this.ciudadService.findAll();
  }

  @Get(':ciudadCodigo')
  async findOne(@Param('ciudadCodigo') ciudadCodigo: string) {
    return await this.ciudadService.findOne(ciudadCodigo);
  }

  @Post()
  async create(@Body() ciudadDto: CiudadDto) {
    const ciudad: CiudadEntity = plainToInstance(CiudadEntity, ciudadDto);
    return await this.ciudadService.create(ciudad);
  }

  @Put(':ciudadCodigo')
  async update(@Param('ciudadCodigo') ciudadCodigo: string, @Body() ciudadDto: CiudadDto) {
    const ciudad: CiudadEntity = plainToInstance(CiudadEntity, ciudadDto);
    return await this.ciudadService.update(ciudadCodigo, ciudad);
  }

  @Delete(':ciudadCodigo')
  @HttpCode(204)
  async delete(@Param('ciudadCodigo') ciudadCodigo: string) {
    return await this.ciudadService.delete(ciudadCodigo);
  }

}
