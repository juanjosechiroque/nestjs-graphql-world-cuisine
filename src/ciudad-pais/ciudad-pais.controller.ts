/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaisEntity } from 'src/pais/pais.entity';
import { PaisDto } from '../pais/pais.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CiudadPaisService } from './ciudad-pais.service';
import { Role } from "../user/role.enum";
import { HasRoles } from "../user/roles.decorator";
import { RolesGuard } from 'src/auth/guards/roles.guard';

@Controller('ciudades')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadPaisController {
    constructor(private readonly ciudadPaisService: CiudadPaisService){}

    @Post(':ciudadCodigo/paises/:paisCodigo')
    @HasRoles(Role.ADMIN)
    async addPaisCiudad(@Param('ciudadCodigo') ciudadCodigo: string, @Param('paisCodigo') paisCodigo: string){
        return await this.ciudadPaisService.addPaisCiudad(ciudadCodigo, paisCodigo);
    }

    @Get(':ciudadCodigo/paises/:paisCodigo')
    @HasRoles(Role.ADMIN,Role.READER)
    async findPaisByCiudadIdPaisId(@Param('ciudadCodigo') ciudadCodigo: string, @Param('paisCodigo') paisCodigo: string){
        return await this.ciudadPaisService.findPaisByCiudadIdPaisId(ciudadCodigo, paisCodigo);
    }

    @Get(':ciudadCodigo/paises')
    @HasRoles(Role.ADMIN,Role.READER)
    async findPaisesByCiudadId(@Param('ciudadCodigo') ciudadCodigo: string){
        return await this.ciudadPaisService.findPaissByCiudadId(ciudadCodigo);
    }

    @Put(':ciudadCodigo/paises')
    @HasRoles(Role.ADMIN)
    async associatePaisesCiudad(@Body() paisesDto: PaisDto, @Param('ciudadCodigo') ciudadCodigo: string){
        const paises = plainToInstance(PaisEntity, paisesDto)
        return await this.ciudadPaisService.associatePaissCiudad(ciudadCodigo, paises);
    }
    
    @Delete(':ciudadCodigo/paises/:paisCodigo')
    @HttpCode(204)
    @HasRoles(Role.ADMIN)
    async deletePaisCiudad(@Param('ciudadCodigo') ciudadCodigo: string, @Param('paisCodigo') paisCodigo: string){
        return await this.ciudadPaisService.deletePaisCiudad(ciudadCodigo, paisCodigo);
    }
}
