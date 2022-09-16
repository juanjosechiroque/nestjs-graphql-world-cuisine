/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../user/role.enum';
import { HasRoles } from '../user/roles.decorator';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RestauranteDto } from '../restaurante/restaurante.dto';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CulturaRestauranteService } from './cultura-restaurante.service';

@UseGuards(JwtAuthGuard, RolesGuard)
@Controller('culturasgastronomicas')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaRestauranteController {
    constructor(private readonly culturaRestauranteService: CulturaRestauranteService){}

    @Post(':culturaId/restaurantes/:restauranteId')
    @HasRoles(Role.ADMIN)
    async addPaisCultura(@Param('culturaId') culturaId: string, @Param('restauranteId') restauranteId: string){
        return await this.culturaRestauranteService.addRestauranteCultura(culturaId, restauranteId);
    }

    @Get(':culturaId/restaurantes/:restauranteId')
    @HasRoles(Role.ADMIN,Role.READER)
    async findPaisByCulturaIdPaisId(@Param('culturaId') culturaId: string, @Param('restauranteId') restauranteId: string){
        return await this.culturaRestauranteService.findRestauranteByCulturaIdRestauranteId(culturaId, restauranteId);
    }

    @Get(':culturaId/restaurantes')
    @HasRoles(Role.ADMIN,Role.READER)
    async findPaisesByCulturaId(@Param('culturaId') culturaId: string){
        return await this.culturaRestauranteService.findRestaurantesByCulturaId(culturaId);
    }

    @Put(':culturaId/restaurantes')
    @HasRoles(Role.ADMIN)
    async associatePaisesCultura(@Body() restaurantesDto: RestauranteDto[], @Param('culturaId') culturaId: string){
        const restaurantes = plainToInstance(RestauranteEntity, restaurantesDto)
        return await this.culturaRestauranteService.associateRestaurantesCultura(culturaId, restaurantes);
    }
    
    @Delete(':culturaId/restaurantes/:restauranteId')
    @HttpCode(204)
    @HasRoles(Role.ADMIN)
    async deletePaisCultura(@Param('culturaId') culturaId: string, @Param('restauranteId') restauranteId: string){
        return await this.culturaRestauranteService.deleteRestauranteCultura(culturaId, restauranteId);
    }
}