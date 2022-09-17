import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { HasRoles } from '../user/roles.decorator';
import { Role } from '../user/role.enum';
import { RecetaEntity } from 'src/receta/receta.entity';
import { RecetaDto } from '../receta/receta.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CulturaRecetaService } from './cultura-receta.service';

@Controller('culturas')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(BusinessErrorsInterceptor) 
export class CulturaRecetaController {

    constructor(private readonly culturaRecetaService: CulturaRecetaService){}

    @Post(':culturaCodigo/recetas/:recetaCodigo')
    @HasRoles(Role.ADMIN)
    async addRecetaCultura(@Param('culturaCodigo') culturaCodigo: string, @Param('recetaCodigo') recetaCodigo: string){
        return await this.culturaRecetaService.addRecetaCultura(culturaCodigo, recetaCodigo);
    }

    @Get(':culturaCodigo/recetas/:recetaCodigo')
    @HasRoles(Role.ADMIN,Role.READER)
    async findRecetaByCulturaIdRecetaId(@Param('culturaCodigo') culturaCodigo: string, @Param('recetaCodigo') recetaCodigo: string){
        return await this.culturaRecetaService.findRecetaByCulturaIdRecetaId(culturaCodigo, recetaCodigo);
    }

    @Get(':culturaCodigo/recetas')
    @HasRoles(Role.ADMIN,Role.READER)
    async findRecetasByCulturaId(@Param('culturaCodigo') culturaCodigo: string){
        return await this.culturaRecetaService.findRecetasByCulturaId(culturaCodigo);
    }

    @Put(':culturaCodigo/recetas')
    @HasRoles(Role.ADMIN)
    async associateRecetasCultura(@Body() recetasDto: RecetaDto[], @Param('culturaCodigo') culturaCodigo: string){
        const recetas = plainToInstance(RecetaEntity, recetasDto)
        return await this.culturaRecetaService.associateRecetasCultura(culturaCodigo, recetas);
    }
    
    @Delete(':culturaCodigo/recetas/:recetaCodigo')
    @HttpCode(204)
    @HasRoles(Role.ADMIN)
    async deleteRecetaCultura(@Param('culturaCodigo') culturaCodigo: string, @Param('recetaCodigo') recetaCodigo: string){
        return await this.culturaRecetaService.deleteRecetaCultura(culturaCodigo, recetaCodigo);
    }


}
