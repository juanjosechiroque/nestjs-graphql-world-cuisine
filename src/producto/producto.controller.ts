/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ProductoDto } from './producto.dto';
import { ProductoEntity } from './producto.entity';
import { ProductoService } from './producto.service';
import { Role } from "../user/role.enum";
import { HasRoles } from "../user/roles.decorator";

@UseGuards(JwtAuthGuard)
@Controller('productos')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoController {
    constructor(private readonly productoService: ProductoService) {}

  @Get()
  @HasRoles(Role.ADMIN)
  async findAll() {
    return await this.productoService.findAll();
  }

  @Get(':productoCodigo')
  @HasRoles(Role.ADMIN)
  async findOne(@Param('productoCodigo') productoCodigo: string) {
    return await this.productoService.findOne(productoCodigo);
  }

  @Post()
  @HasRoles(Role.ADMIN)
  async create(@Body() productoDto: ProductoDto) {
    const producto: ProductoEntity = plainToInstance(ProductoEntity, productoDto);
    return await this.productoService.create(producto);
  }

  @Put(':productoCodigo')
  @HasRoles(Role.ADMIN)
  async update(@Param('productoCodigo') productoCodigo: string, @Body() productoDto: ProductoDto) {
    const producto: ProductoEntity = plainToInstance(ProductoEntity, productoDto);
    return await this.productoService.update(productoCodigo, producto);
  }

  @Delete(':productoCodigo')
  @HttpCode(204)
  @HasRoles(Role.ADMIN)
  async delete(@Param('productoCodigo') productoCodigo: string) {
    return await this.productoService.delete(productoCodigo);
  }

}
