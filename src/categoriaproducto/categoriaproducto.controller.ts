/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CategoriaproductoDto } from './categoriaproducto.dto';
import { CategoriaproductoEntity } from './categoriaproducto.entity';
import { CategoriaproductoService } from './categoriaproducto.service';
import { Role } from "../user/role.enum";
import { Roles } from "../user/roles.decorator";

@UseGuards(JwtAuthGuard)
@Controller('categoriasproducto')
@UseInterceptors(BusinessErrorsInterceptor)
export class CategoriaproductoController {
    constructor(private readonly categoriaproductoService: CategoriaproductoService) {}

  @Get()
  @Roles(Role.ADMIN)
  async findAll() {
    return await this.categoriaproductoService.findAll();
  }

  @Get(':categoriaproductoCodigo')
  @Roles(Role.ADMIN)
  async findOne(@Param('categoriaproductoCodigo') categoriaproductoCodigo: string) {
    return await this.categoriaproductoService.findOne(categoriaproductoCodigo);
  }

  @Post()
  @Roles(Role.ADMIN)
  async create(@Body() categoriaproductoDto: CategoriaproductoDto) {
    const categoriaproducto: CategoriaproductoEntity = plainToInstance(CategoriaproductoEntity, categoriaproductoDto);
    return await this.categoriaproductoService.create(categoriaproducto);
  }

  @Put(':categoriaproductoCodigo')
  @Roles(Role.ADMIN)
  async update(@Param('categoriaproductoCodigo') categoriaproductoCodigo: string, @Body() categoriaproductoDto: CategoriaproductoDto) {
    const categoriaproducto: CategoriaproductoEntity = plainToInstance(CategoriaproductoEntity, categoriaproductoDto);
    return await this.categoriaproductoService.update(categoriaproductoCodigo, categoriaproducto);
  }

  @Delete(':categoriaproductoCodigo')
  @HttpCode(204)
  @Roles(Role.ADMIN)
  async delete(@Param('categoriaproductoCodigo') categoriaproductoCodigo: string) {
    return await this.categoriaproductoService.delete(categoriaproductoCodigo);
  }

}
