import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, SetMetadata, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { Role } from '../user/role.enum';
import { HasRoles } from '../user/roles.decorator';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RestauranteDto } from './restaurante.dto';
import { RestauranteEntity } from './restaurante.entity';
import { RestauranteService } from './restaurante.service';

@Controller('restaurantes')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(BusinessErrorsInterceptor)
export class RestauranteController {

    constructor(
        private readonly restauranteService: RestauranteService
    ){}

    @Get()
    @HasRoles(Role.ADMIN,Role.READER)
    async findAll() {
        return await this.restauranteService.findAll();
    }

    @Get(':restauranteCodigo')
    @HasRoles(Role.ADMIN,Role.READER)
    async findOne(@Param('restauranteCodigo') restauranteCodigo: string) {
        return await this.restauranteService.findOne(restauranteCodigo);
    }

    @Post()
    @HasRoles(Role.ADMIN)
    async create(@Body() restauranteDto: RestauranteDto) {
        const restaurante = plainToInstance(RestauranteEntity, restauranteDto)
        return await this.restauranteService.create(restaurante);
    }
    
    @Put(':restauranteCodigo')
    @HasRoles(Role.ADMIN)
    async update(@Param('restauranteCodigo') restauranteCodigo: string, @Body() restauranteDto: RestauranteDto){
        const restaurante: RestauranteEntity = plainToInstance(RestauranteEntity, restauranteDto);
        return await this.restauranteService.update(restauranteCodigo, restaurante);
    }

    @Delete(':restauranteCodigo')
    @HttpCode(204)
    @HasRoles(Role.ADMIN,Role.URESTAURANTE)
    async delete(@Param('restauranteCodigo') restauranteCodigo: string) {
        return await this.restauranteService.delete(restauranteCodigo);
    }

}
