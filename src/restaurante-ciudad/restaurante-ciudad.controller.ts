/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { CiudadDto } from 'src/ciudad/ciudad.dto';
import { CiudadEntity } from 'src/ciudad/ciudad.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RestauranteCiudadService } from './restaurante-ciudad.service';

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

    @Put(':restauranteId/ciudades')
    async associateCiudadRestaurante(@Body() ciudadDto: CiudadDto, @Param('restauranteId') restauranteId: string){
        const ciudad = plainToInstance(CiudadEntity, ciudadDto)
        return await this.restauranteCiudadService.associateCiudadRestaurante(restauranteId, ciudad);
    }
    
    @Delete(':restauranteId/ciudades/:ciudadId')
    @HttpCode(204)
    async deleteCiudadRestaurante(@Param('restauranteId') restauranteId: string, @Param('ciudadId') ciudadId: string){
        return await this.restauranteCiudadService.deleteCiudadRestaurante(restauranteId, ciudadId);
    }
    
}