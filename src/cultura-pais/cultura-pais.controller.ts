/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { PaisEntity } from '../pais/pais.entity';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CulturaPaisService } from './cultura-pais.service';
import { PaisDto } from '../pais/pais.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { Role } from '../user/role.enum';
import { HasRoles } from '../user/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';

@UseGuards(JwtAuthGuard,RolesGuard)
@Controller('culturasgastronomicas')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaPaisController {
    constructor(private readonly culturaPaisService: CulturaPaisService){}

    @Post(':culturaId/paises/:paisId')
    @HasRoles(Role.ADMIN)
    async addPaisCultura(@Param('culturaId') culturaId: string, @Param('paisId') paisId: string){
        return await this.culturaPaisService.addPaisCultura(culturaId, paisId);
    }

    @Get(':culturaId/paises/:paisId')
    @HasRoles(Role.ADMIN,Role.READER)
    async findPaisByCulturaIdPaisId(@Param('culturaId') culturaId: string, @Param('paisId') paisId: string){
        return await this.culturaPaisService.findPaisByCulturaIdPaisId(culturaId, paisId);
    }

    @Get(':culturaId/paises')
    @HasRoles(Role.ADMIN,Role.READER)
    async findPaisesByCulturaId(@Param('culturaId') culturaId: string){
        return await this.culturaPaisService.findPaisesByCulturaId(culturaId);
    }

    @Put(':culturaId/paises')
    @HasRoles(Role.ADMIN)
    async associatePaisesCultura(@Body() paisesDto: PaisDto[], @Param('culturaId') culturaId: string){
        const paises = plainToInstance(PaisEntity, paisesDto)
        return await this.culturaPaisService.associatePaisesCultura(culturaId, paises);
    }
    
    @Delete(':culturaId/paises/:paisId')
    @HttpCode(204)
    @HasRoles(Role.ADMIN)
    async deletePaisCultura(@Param('culturaId') culturaId: string, @Param('paisId') paisId: string){
        return await this.culturaPaisService.deletePaisCultura(culturaId, paisId);
    }
}