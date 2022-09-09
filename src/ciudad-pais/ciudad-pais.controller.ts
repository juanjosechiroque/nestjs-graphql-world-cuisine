/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PaisEntity } from 'src/pais/pais.entity';
import { PaisDto } from '../pais/pais.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CiudadPaisService } from './ciudad-pais.service';

@Controller('ciudades')
@UseInterceptors(BusinessErrorsInterceptor)
export class CiudadPaisController {
    constructor(private readonly ciudadPaisService: CiudadPaisService){}

    @Post(':ciudadCodigo/paises/:paisCodigo')
    async addPaisCiudad(@Param('ciudadCodigo') ciudadCodigo: string, @Param('paisCodigo') paisCodigo: string){
        return await this.ciudadPaisService.addPaisCiudad(ciudadCodigo, paisCodigo);
    }

    @Get(':ciudadCodigo/paises/:paisCodigo')
    async findPaisByCiudadIdPaisId(@Param('ciudadCodigo') ciudadCodigo: string, @Param('paisCodigo') paisCodigo: string){
        return await this.ciudadPaisService.findPaisByCiudadIdPaisId(ciudadCodigo, paisCodigo);
    }

    @Get(':ciudadCodigo/paises')
    async findPaisesByCiudadId(@Param('ciudadCodigo') ciudadCodigo: string){
        return await this.ciudadPaisService.findPaissByCiudadId(ciudadCodigo);
    }

    @Put(':ciudadCodigo/paises')
    async associatePaisesCiudad(@Body() paisesDto: PaisDto, @Param('ciudadCodigo') ciudadCodigo: string){
        const paises = plainToInstance(PaisEntity, paisesDto)
        return await this.ciudadPaisService.associatePaissCiudad(ciudadCodigo, paises);
    }
    
    @Delete(':ciudadCodigo/paises/:paisCodigo')
    @HttpCode(204)
    async deletePaisCiudad(@Param('ciudadCodigo') ciudadCodigo: string, @Param('paisCodigo') paisCodigo: string){
        return await this.ciudadPaisService.deletePaisCiudad(ciudadCodigo, paisCodigo);
    }
}
