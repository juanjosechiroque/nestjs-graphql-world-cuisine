/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RestauranteDto } from '../restaurante/restaurante.dto';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CulturaRestauranteService } from './cultura-restaurante.service';

@Controller('culturasgastronomicas')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaRestauranteController {
    constructor(private readonly culturaRestauranteService: CulturaRestauranteService){}

    @Post(':culturaId/restaurantes/:restauranteId')
    async addPaisCultura(@Param('culturaId') culturaId: string, @Param('restauranteId') restauranteId: string){
        return await this.culturaRestauranteService.addRestauranteCultura(culturaId, restauranteId);
    }

    @Get(':culturaId/restaurantes/:restauranteId')
    async findPaisByCulturaIdPaisId(@Param('culturaId') culturaId: string, @Param('restauranteId') restauranteId: string){
        return await this.culturaRestauranteService.findRestauranteByCulturaIdRestauranteId(culturaId, restauranteId);
    }

    @Get(':culturaId/restaurantes')
    async findPaisesByCulturaId(@Param('culturaId') culturaId: string){
        return await this.culturaRestauranteService.findRestaurantesByCulturaId(culturaId);
    }

    @Put(':culturaId/restaurantes')
    async associatePaisesCultura(@Body() restaurantesDto: RestauranteDto[], @Param('culturaId') culturaId: string){
        const restaurantes = plainToInstance(RestauranteEntity, restaurantesDto)
        return await this.culturaRestauranteService.associateRestaurantesCultura(culturaId, restaurantes);
    }
    
    @Delete(':culturaId/restaurantes/:restauranteId')
    @HttpCode(204)
    async deletePaisCultura(@Param('culturaId') culturaId: string, @Param('restauranteId') restauranteId: string){
        return await this.culturaRestauranteService.deleteRestauranteCultura(culturaId, restauranteId);
    }
}