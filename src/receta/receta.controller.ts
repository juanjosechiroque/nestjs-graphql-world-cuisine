import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RecetaDto } from './receta.dto';
import { RecetaEntity } from './receta.entity';
import { RecetaService } from './receta.service';


@Controller('recetas')
@UseInterceptors(BusinessErrorsInterceptor)
export class RecetaController {

    constructor(private readonly recetaService: RecetaService) {}

  @Get()
  async findAll() {
    return await this.recetaService.findAll();
  }

  @Get(':recetaCodigo')
  async findOne(@Param('recetaCodigo') recetaCodigo: string) {
    return await this.recetaService.findOne(recetaCodigo);
  }

  @Post()
  async create(@Body() RecetaDto: RecetaDto) {
    const receta: RecetaEntity = plainToInstance(RecetaEntity, RecetaDto);
    return await this.recetaService.create(receta);
  }

  @Put(':recetaCodigo')
  async update(@Param('recetaCodigo') recetaCodigo: string, @Body() RecetaDto: RecetaDto) {
    const receta: RecetaEntity = plainToInstance(RecetaEntity, RecetaDto);
    return await this.recetaService.update(recetaCodigo, receta);
  }

  @Delete(':recetaCodigo')
  @HttpCode(204)
  async delete(@Param('recetaCodigo') recetaCodigo: string) {
    return await this.recetaService.delete(recetaCodigo);
  }

}
