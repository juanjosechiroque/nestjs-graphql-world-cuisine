/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ProductoEntity } from 'src/producto/producto.entity';
import { ProductoDto } from '../producto/producto.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CulturaProductoService } from './cultura-producto.service';
import { Role } from "../user/role.enum";
import { Roles } from "../user/roles.decorator";

@UseGuards(JwtAuthGuard)
@Controller('culturasgastronomicas')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaProductoController {
    constructor(private readonly culturaProductoService: CulturaProductoService){}

    @Post(':culturaId/productos/:productoCodigo')
    @Roles(Role.ADMIN)
    async addProductoCultura(@Param('culturaId') culturaId: string, @Param('productoCodigo') productoCodigo: string){
        return await this.culturaProductoService.addProductoCultura(culturaId, productoCodigo);
    }

    @Get(':culturaId/productos/:productoCodigo')
    @Roles(Role.ADMIN)
    async findProductoByCulturaIdProductoId(@Param('culturaId') culturaId: string, @Param('productoCodigo') productoCodigo: string){
        return await this.culturaProductoService.findProductoByCulturaIdProductoId(culturaId, productoCodigo);
    }

    @Get(':culturaId/productos')
    @Roles(Role.ADMIN)
    async findProductosByCulturaId(@Param('culturaId') culturaId: string){
        return await this.culturaProductoService.findProductoByCulturaId(culturaId);
    }

    @Put(':culturaId/productos')
    @Roles(Role.ADMIN)
    async associateProductosCultura(@Body() productosDto: ProductoDto[], @Param('culturaId') culturaId: string){
        const productos = plainToInstance(ProductoEntity, productosDto)
        return await this.culturaProductoService.associateProductoCultura(culturaId, productos);
    }
    
    @Delete(':culturaId/productos/:productoCodigo')
    @HttpCode(204)
    @Roles(Role.ADMIN)
    async deleteProductoCultura(@Param('culturaId') culturaId: string, @Param('productoCodigo') productoCodigo: string){
        return await this.culturaProductoService.deleteProductoCultura(culturaId, productoCodigo);
    }
}