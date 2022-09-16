/* eslint-disable prettier/prettier */
import { Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Role } from '../user/role.enum';
import { HasRoles } from '../user/roles.decorator';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RestauranteCiudadService } from './restaurante-ciudad.service';

@UseGuards(JwtAuthGuard,RolesGuard)
@Controller('restaurantes')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestauranteCiudadController {
    constructor(private readonly restauranteCiudadService: RestauranteCiudadService){}

    @Post(':restauranteId/ciudades/:ciudadId')
    @HasRoles(Role.ADMIN)
    async addCiudadRestaurante(@Param('restauranteId') restauranteId: string, @Param('ciudadId') ciudadId: string){
        return await this.restauranteCiudadService.addCiudadRestaurante(restauranteId, ciudadId);
    }

    @Get(':restauranteId/ciudades/:ciudadId')
    @HasRoles(Role.ADMIN,Role.READER)
    async findCiudadByRestauranteIdCiudadId(@Param('restauranteId') restauranteId: string, @Param('ciudadId') ciudadId: string){
        return await this.restauranteCiudadService.findCiudadByRestauranteIdCiudadId(restauranteId, ciudadId);
    }

    @Get(':restauranteId/ciudades')
    @HasRoles(Role.ADMIN,Role.READER)
    async findCiudadByRestauranteId(@Param('restauranteId') restauranteId: string){
        return await this.restauranteCiudadService.findCiudadByRestauranteId(restauranteId);
    }

    @Put(':restauranteId/ciudades/:ciudadId')
    @HasRoles(Role.ADMIN)
    async associateCiudadRestaurante(@Param('restauranteId') restauranteId: string, @Param('ciudadId') ciudadId: string){
        return await this.restauranteCiudadService.associateCiudadRestaurante(restauranteId, ciudadId);
    }
    
    @Delete(':restauranteId/ciudades/:ciudadId')
    @HttpCode(204)
    @HasRoles(Role.ADMIN)
    async deleteCiudadRestaurante(@Param('restauranteId') restauranteId: string, @Param('ciudadId') ciudadId: string){
        return await this.restauranteCiudadService.deleteCiudadRestaurante(restauranteId, ciudadId);
    }
    
}