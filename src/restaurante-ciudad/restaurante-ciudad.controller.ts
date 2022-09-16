/* eslint-disable prettier/prettier */
import { Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RestauranteCiudadService } from './restaurante-ciudad.service';

@UseGuards(JwtAuthGuard)
@Controller('restaurantes')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestauranteCiudadController {
    constructor(private readonly restauranteCiudadService: RestauranteCiudadService){}

    @Post(':restauranteId/ciudades/:ciudadId')
    async addCiudadRestaurante(@Param('restauranteId') restauranteId: string, @Param('ciudadId') ciudadId: string){
        return await this.restauranteCiudadService.addCiudadRestaurante(restauranteId, ciudadId);
    }

    @Get(':restauranteId/ciudades/:ciudadId')
    async findCiudadByRestauranteIdCiudadId(@Param('restauranteId') restauranteId: string, @Param('ciudadId') ciudadId: string){
        return await this.restauranteCiudadService.findCiudadByRestauranteIdCiudadId(restauranteId, ciudadId);
    }

    @Get(':restauranteId/ciudades')
    async findCiudadByRestauranteId(@Param('restauranteId') restauranteId: string){
        return await this.restauranteCiudadService.findCiudadByRestauranteId(restauranteId);
    }

    @Put(':restauranteId/ciudades/:ciudadId')
    async associateCiudadRestaurante(@Param('restauranteId') restauranteId: string, @Param('ciudadId') ciudadId: string){
        return await this.restauranteCiudadService.associateCiudadRestaurante(restauranteId, ciudadId);
    }
    
    @Delete(':restauranteId/ciudades/:ciudadId')
    @HttpCode(204)
    async deleteCiudadRestaurante(@Param('restauranteId') restauranteId: string, @Param('ciudadId') ciudadId: string){
        return await this.restauranteCiudadService.deleteCiudadRestaurante(restauranteId, ciudadId);
    }
    
}