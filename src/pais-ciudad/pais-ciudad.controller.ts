/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { CiudadEntity } from 'src/ciudad/ciudad.entity';
import { CiudadDto } from '../ciudad/ciudad.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PaisCiudadService } from './pais-ciudad.service';
import { Role } from "../user/role.enum";
import { HasRoles } from "../user/roles.decorator";
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('paises')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(BusinessErrorsInterceptor)
export class PaisCiudadController {
    constructor(private readonly paisCiudadService: PaisCiudadService){}

    @Post(':paisCodigo/ciudades/:ciudadCodigo')
    @HasRoles(Role.ADMIN)
    async addCiudadPais(@Param('paisCodigo') paisCodigo: string, @Param('ciudadCodigo') ciudadCodigo: string){
        return await this.paisCiudadService.addCiudadPais(paisCodigo, ciudadCodigo);
    }

    @Get(':paisCodigo/ciudades/:ciudadCodigo')
    @HasRoles(Role.ADMIN,Role.READER)
    async findCiudadByPaisIdCiudadId(@Param('paisCodigo') paisCodigo: string, @Param('ciudadCodigo') ciudadCodigo: string){
        return await this.paisCiudadService.findCiudadByPaisIdCiudadId(paisCodigo, ciudadCodigo);
    }

    @Get(':paisCodigo/ciudades')
    @HasRoles(Role.ADMIN,Role.READER)
    async findCiudadesByPaisId(@Param('paisCodigo') paisCodigo: string){
        return await this.paisCiudadService.findCiudadesByPaisId(paisCodigo);
    }

    @Put(':paisCodigo/ciudades')
    @HasRoles(Role.ADMIN)
    async associateCiudadesPais(@Body() ciudadesDto: CiudadDto[], @Param('paisCodigo') paisCodigo: string){
        const ciudades = plainToInstance(CiudadEntity, ciudadesDto)
        return await this.paisCiudadService.associateCiudadesPais(paisCodigo, ciudades);
    }
    
    @Delete(':paisCodigo/ciudades/:ciudadCodigo')
    @HttpCode(204)
    @HasRoles(Role.ADMIN)
    async deleteCiudadPais(@Param('paisCodigo') paisCodigo: string, @Param('ciudadCodigo') ciudadCodigo: string){
        return await this.paisCiudadService.deleteCiudadPais(paisCodigo, ciudadCodigo);
    }
}
