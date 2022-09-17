/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { ProductoEntity } from 'src/producto/producto.entity';
import { ProductoDto } from '../producto/producto.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CulturaProductoService } from './cultura-producto.service';
import { Role } from "../user/role.enum";
import { HasRoles } from "../user/roles.decorator";
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('culturasgastronomicas')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaProductoController {
    constructor(private readonly culturaProductoService: CulturaProductoService){}

    @Post(':culturaId/productos/:productoCodigo')
    @HasRoles(Role.ADMIN)
    async addProductoCultura(@Param('culturaId') culturaId: string, @Param('productoCodigo') productoCodigo: string){
        return await this.culturaProductoService.addProductoCultura(culturaId, productoCodigo);
    }

    @Get(':culturaId/productos/:productoCodigo')
    @HasRoles(Role.ADMIN,Role.READER)
    async findProductoByCulturaIdProductoId(@Param('culturaId') culturaId: string, @Param('productoCodigo') productoCodigo: string){
        return await this.culturaProductoService.findProductoByCulturaIdProductoId(culturaId, productoCodigo);
    }

    @Get(':culturaId/productos')
    @HasRoles(Role.ADMIN,Role.READER)
    async findProductosByCulturaId(@Param('culturaId') culturaId: string){
        return await this.culturaProductoService.findProductoByCulturaId(culturaId);
    }

    @Put(':culturaId/productos')
    @HasRoles(Role.ADMIN)
    async associateProductosCultura(@Body() productosDto: ProductoDto[], @Param('culturaId') culturaId: string){
        const productos = plainToInstance(ProductoEntity, productosDto)
        return await this.culturaProductoService.associateProductoCultura(culturaId, productos);
    }
    
    @Delete(':culturaId/productos/:productoCodigo')
    @HttpCode(204)
    @HasRoles(Role.ADMIN)
    async deleteProductoCultura(@Param('culturaId') culturaId: string, @Param('productoCodigo') productoCodigo: string){
        return await this.culturaProductoService.deleteProductoCultura(culturaId, productoCodigo);
    }
}