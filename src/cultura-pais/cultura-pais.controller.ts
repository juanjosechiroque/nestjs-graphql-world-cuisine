/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PaisEntity } from '../pais/pais.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CulturaPaisService } from './cultura-pais.service';
import { PaisDto } from '../pais/pais.dto';

@Controller('culturasgastronomicas')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaPaisController {
    constructor(private readonly culturaPaisService: CulturaPaisService){}

    @Post(':culturaId/paises/:paisId')
    async addPaisCultura(@Param('culturaId') culturaId: string, @Param('paisId') paisId: string){
        return await this.culturaPaisService.addPaisCultura(culturaId, paisId);
    }

    @Get(':culturaId/paises/:paisId')
    async findPaisByCulturaIdPaisId(@Param('culturaId') culturaId: string, @Param('paisId') paisId: string){
        return await this.culturaPaisService.findPaisByCulturaIdPaisId(culturaId, paisId);
    }

    @Get(':culturaId/paises')
    async findPaisesByCulturaId(@Param('culturaId') culturaId: string){
        return await this.culturaPaisService.findPaisesByCulturaId(culturaId);
    }

    @Put(':culturaId/paises')
    async associatePaisesCultura(@Body() paisesDto: PaisDto[], @Param('culturaId') culturaId: string){
        const paises = plainToInstance(PaisEntity, paisesDto)
        return await this.culturaPaisService.associatePaisesCultura(culturaId, paises);
    }
    
    @Delete(':culturaId/paises/:paisId')
    @HttpCode(204)
    async deletePaisCultura(@Param('culturaId') culturaId: string, @Param('paisId') paisId: string){
        return await this.culturaPaisService.deletePaisCultura(culturaId, paisId);
    }
}