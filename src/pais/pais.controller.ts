/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PaisDto } from './pais.dto';
import { PaisEntity } from './pais.entity';
import { PaisService } from './pais.service';

@Controller('paises')
@UseInterceptors(BusinessErrorsInterceptor)
export class PaisController {
    constructor(private readonly paisService: PaisService) {}

  @Get()
  async findAll() {
    return await this.paisService.findAll();
  }

  @Get(':paisCodigo')
  async findOne(@Param('paisCodigo') paisCodigo: string) {
    return await this.paisService.findOne(paisCodigo);
  }

  @Post()
  async create(@Body() paisDto: PaisDto) {
    const pais: PaisEntity = plainToInstance(PaisEntity, paisDto);
    return await this.paisService.create(pais);
  }

  @Put(':paisCodigo')
  async update(@Param('paisCodigo') paisCodigo: string, @Body() paisDto: PaisDto) {
    const pais: PaisEntity = plainToInstance(PaisEntity, paisDto);
    return await this.paisService.update(paisCodigo, pais);
  }

  @Delete(':paisCodigo')
  @HttpCode(204)
  async delete(@Param('paisCodigo') paisCodigo: string) {
    return await this.paisService.delete(paisCodigo);
  }

}
