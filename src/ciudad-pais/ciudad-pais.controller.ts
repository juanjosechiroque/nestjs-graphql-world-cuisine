/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { PaisEntity } from 'src/pais/pais.entity';
import { PaisDto } from '../pais/pais.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CiudadPaisService } from './ciudad-pais.service';
import { Role } from "../user/role.enum";
import { Roles } from "../user/roles.decorator";

@UseGuards(JwtAuthGuard)
@Controller('ciudades')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadPaisController {
    constructor(private readonly ciudadPaisService: CiudadPaisService){}

    @Post(':ciudadCodigo/paises/:paisCodigo')
    @Roles(Role.ADMIN)
    async addPaisCiudad(@Param('ciudadCodigo') ciudadCodigo: string, @Param('paisCodigo') paisCodigo: string){
        return await this.ciudadPaisService.addPaisCiudad(ciudadCodigo, paisCodigo);
    }

    @Get(':ciudadCodigo/paises/:paisCodigo')
    @Roles(Role.ADMIN)
    async findPaisByCiudadIdPaisId(@Param('ciudadCodigo') ciudadCodigo: string, @Param('paisCodigo') paisCodigo: string){
        return await this.ciudadPaisService.findPaisByCiudadIdPaisId(ciudadCodigo, paisCodigo);
    }

    @Get(':ciudadCodigo/paises')
    @Roles(Role.ADMIN)
    async findPaisesByCiudadId(@Param('ciudadCodigo') ciudadCodigo: string){
        return await this.ciudadPaisService.findPaissByCiudadId(ciudadCodigo);
    }

    @Put(':ciudadCodigo/paises')
    @Roles(Role.ADMIN)
    async associatePaisesCiudad(@Body() paisesDto: PaisDto, @Param('ciudadCodigo') ciudadCodigo: string){
        const paises = plainToInstance(PaisEntity, paisesDto)
        return await this.ciudadPaisService.associatePaissCiudad(ciudadCodigo, paises);
    }
    
    @Delete(':ciudadCodigo/paises/:paisCodigo')
    @HttpCode(204)
    @Roles(Role.ADMIN)
    async deletePaisCiudad(@Param('ciudadCodigo') ciudadCodigo: string, @Param('paisCodigo') paisCodigo: string){
        return await this.ciudadPaisService.deletePaisCiudad(ciudadCodigo, paisCodigo);
    }
}
