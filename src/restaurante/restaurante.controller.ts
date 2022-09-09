import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RestauranteDto } from './restaurante.dto';
import { RestauranteEntity } from './restaurante.entity';
import { RestauranteService } from './restaurante.service';

@Controller('restaurantes')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestauranteController {

    constructor(
        private readonly restauranteService: RestauranteService
    ){}

    @Get()
    async findAll() {
        return await this.restauranteService.findAll();
    }

    @Get(':restauranteCodigo')
    async findOne(@Param('restauranteCodigo') restauranteCodigo: string) {
        return await this.restauranteService.findOne(restauranteCodigo);
    }

    @Post()
    async create(@Body() restauranteDto: RestauranteDto) {
        const restaurante = plainToInstance(RestauranteEntity, restauranteDto)
        return await this.restauranteService.create(restaurante);
    }
    
    @Put(':restauranteCodigo')
    async update(@Param('restauranteCodigo') restauranteCodigo: string, @Body() restauranteDto: RestauranteDto){
        const restaurante: RestauranteEntity = plainToInstance(RestauranteEntity, restauranteDto);
        return await this.restauranteService.update(restauranteCodigo, restaurante);
    }

    @Delete(':restauranteCodigo')
    @HttpCode(204)
    async delete(@Param('restauranteCodigo') restauranteCodigo: string) {
        return await this.restauranteService.delete(restauranteCodigo);
    }

}
