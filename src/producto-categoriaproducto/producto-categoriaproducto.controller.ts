/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CategoriaproductoEntity } from 'src/categoriaproducto/categoriaproducto.entity';
import { CategoriaproductoDto } from '../categoriaproducto/categoriaproducto.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { ProductoCategoriaproductoService } from './producto-categoriaproducto.service';
import { Role } from "../user/role.enum";
import { Roles } from "../user/roles.decorator";

@UseGuards(JwtAuthGuard)
@Controller('productos')
@UseInterceptors(BusinessErrorsInterceptor)
export class ProductoCategoriaproductoController {
    constructor(private readonly productoCategoriaproductoService: ProductoCategoriaproductoService){}

    @Post(':productoCodigo/categoriaproductos/:categoriaproductoCodigo')
    @Roles(Role.ADMIN)
    async addCategoriaproductoProducto(@Param('productoCodigo') productoCodigo: string, @Param('categoriaproductoCodigo') categoriaproductoCodigo: string){
        return await this.productoCategoriaproductoService.addCategoriaproductoProducto(productoCodigo, categoriaproductoCodigo);
    }

    @Get(':productoCodigo/categoriaproductos/:categoriaproductoCodigo')
    @Roles(Role.ADMIN)
    async findCategoriaproductoByProductoIdCategoriaproductoId(@Param('productoCodigo') productoCodigo: string, @Param('categoriaproductoCodigo') categoriaproductoCodigo: string){
        return await this.productoCategoriaproductoService.findCategoriaproductoByProductoIdCategoriaproductoId(productoCodigo, categoriaproductoCodigo);
    }

    @Get(':productoCodigo/categoriaproductos')
    @Roles(Role.ADMIN)
    async findCategoriaproductosByProductoId(@Param('productoCodigo') productoCodigo: string){
        return await this.productoCategoriaproductoService.findCategoriaproductosByProductoId(productoCodigo);
    }

    @Put(':productoCodigo/categoriaproductos')
    @Roles(Role.ADMIN)
    async associateCategoriaproductosProducto(@Body() categoriaproductosDto: CategoriaproductoDto, @Param('productoCodigo') productoCodigo: string){
        const categoriaproductos = plainToInstance(CategoriaproductoEntity, categoriaproductosDto)
        return await this.productoCategoriaproductoService.associateCategoriaproductosProducto(productoCodigo, categoriaproductos);
    }
    
    @Delete(':productoCodigo/categoriaproductos/:categoriaproductoCodigo')
    @HttpCode(204)
    @Roles(Role.ADMIN)
    async deleteCategoriaproductoProducto(@Param('productoCodigo') productoCodigo: string, @Param('categoriaproductoCodigo') categoriaproductoCodigo: string){
        return await this.productoCategoriaproductoService.deleteCategoriaproductoProducto(productoCodigo, categoriaproductoCodigo);
    }
}
