import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { Roles } from 'src/auth/decorator/role-decorator';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { Role } from 'src/user/role.enum';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RestauranteDto } from './restaurante.dto';
import { RestauranteEntity } from './restaurante.entity';
import { RestauranteService } from './restaurante.service';

@UseGuards(JwtAuthGuard)
@Controller('restaurantes')
@UseInterceptors(BusinessErrorsInterceptor)
export class RestauranteController {

    constructor(
        private readonly restauranteService: RestauranteService
    ){}

    @Roles(Role.ADMIN)
    @Get()
    async findAll() {
        return await this.restauranteService.findAll();
    }

    @Roles(Role.ADMIN)
    @Get(':restauranteCodigo')
    async findOne(@Param('restauranteCodigo') restauranteCodigo: string) {
        return await this.restauranteService.findOne(restauranteCodigo);
    }

    @Roles(Role.ADMIN)
    @Post()
    async create(@Body() restauranteDto: RestauranteDto) {
        const restaurante = plainToInstance(RestauranteEntity, restauranteDto)
        return await this.restauranteService.create(restaurante);
    }
    
    @Roles(Role.ADMIN)
    @Put(':restauranteCodigo')
    async update(@Param('restauranteCodigo') restauranteCodigo: string, @Body() restauranteDto: RestauranteDto){
        const restaurante: RestauranteEntity = plainToInstance(RestauranteEntity, restauranteDto);
        return await this.restauranteService.update(restauranteCodigo, restaurante);
    }

    @Roles(Role.ADMIN, Role.URESTAURANTE)
    @Delete(':restauranteCodigo')
    @HttpCode(204)
    async delete(@Param('restauranteCodigo') restauranteCodigo: string) {
        return await this.restauranteService.delete(restauranteCodigo);
    }

}
