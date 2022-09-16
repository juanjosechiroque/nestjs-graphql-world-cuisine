/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ProductoEntity } from 'src/producto/producto.entity';
import { ProductoDto } from '../producto/producto.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CulturaProductoService } from './cultura-producto.service';

@UseGuards(JwtAuthGuard)
@Controller('culturasgastronomicas')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaProductoController {
    constructor(private readonly culturaProductoService: CulturaProductoService){}

    @Post(':culturaId/productos/:productoCodigo')
    async addProductoCultura(@Param('culturaId') culturaId: string, @Param('productoCodigo') productoCodigo: string){
        return await this.culturaProductoService.addProductoCultura(culturaId, productoCodigo);
    }

    @Get(':culturaId/productos/:productoCodigo')
    async findProductoByCulturaIdProductoId(@Param('culturaId') culturaId: string, @Param('productoCodigo') productoCodigo: string){
        return await this.culturaProductoService.findProductoByCulturaIdProductoId(culturaId, productoCodigo);
    }

    @Get(':culturaId/productos')
    async findProductosByCulturaId(@Param('culturaId') culturaId: string){
        return await this.culturaProductoService.findProductoByCulturaId(culturaId);
    }

    @Put(':culturaId/productos')
    async associateProductosCultura(@Body() productosDto: ProductoDto[], @Param('culturaId') culturaId: string){
        const productos = plainToInstance(ProductoEntity, productosDto)
        return await this.culturaProductoService.associateProductoCultura(culturaId, productos);
    }
    
    @Delete(':culturaId/productos/:productoCodigo')
    @HttpCode(204)
    async deleteProductoCultura(@Param('culturaId') culturaId: string, @Param('productoCodigo') productoCodigo: string){
        return await this.culturaProductoService.deleteProductoCultura(culturaId, productoCodigo);
    }
}