/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CategoriaproductoDto } from './categoriaproducto.dto';
import { CategoriaproductoEntity } from './categoriaproducto.entity';
import { CategoriaproductoService } from './categoriaproducto.service';

@UseGuards(JwtAuthGuard)
@Controller('categoriasproducto')
@UseInterceptors(BusinessErrorsInterceptor)
export class CategoriaproductoController {
    constructor(private readonly categoriaproductoService: CategoriaproductoService) {}

  @Get()
  async findAll() {
    return await this.categoriaproductoService.findAll();
  }

  @Get(':categoriaproductoCodigo')
  async findOne(@Param('categoriaproductoCodigo') categoriaproductoCodigo: string) {
    return await this.categoriaproductoService.findOne(categoriaproductoCodigo);
  }

  @Post()
  async create(@Body() categoriaproductoDto: CategoriaproductoDto) {
    const categoriaproducto: CategoriaproductoEntity = plainToInstance(CategoriaproductoEntity, categoriaproductoDto);
    return await this.categoriaproductoService.create(categoriaproducto);
  }

  @Put(':categoriaproductoCodigo')
  async update(@Param('categoriaproductoCodigo') categoriaproductoCodigo: string, @Body() categoriaproductoDto: CategoriaproductoDto) {
    const categoriaproducto: CategoriaproductoEntity = plainToInstance(CategoriaproductoEntity, categoriaproductoDto);
    return await this.categoriaproductoService.update(categoriaproductoCodigo, categoriaproducto);
  }

  @Delete(':categoriaproductoCodigo')
  @HttpCode(204)
  async delete(@Param('categoriaproductoCodigo') categoriaproductoCodigo: string) {
    return await this.categoriaproductoService.delete(categoriaproductoCodigo);
  }

}
