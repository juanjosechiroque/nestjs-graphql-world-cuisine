import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { RecetaEntity } from 'src/receta/receta.entity';
import { RecetaDto } from '../receta/receta.dto';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CulturaRecetaService } from './cultura-receta.service';

@Controller('culturas')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaRecetaController {

    constructor(private readonly culturaRecetaService: CulturaRecetaService){}

    @Post(':culturaCodigo/recetas/:recetaCodigo')
    async addRecetaCultura(@Param('culturaCodigo') culturaCodigo: string, @Param('recetaCodigo') recetaCodigo: string){
        return await this.culturaRecetaService.addRecetaCultura(culturaCodigo, recetaCodigo);
    }

    @Get(':culturaCodigo/recetas/:recetaCodigo')
    async findRecetaByCulturaIdRecetaId(@Param('culturaCodigo') culturaCodigo: string, @Param('recetaCodigo') recetaCodigo: string){
        return await this.culturaRecetaService.findRecetaByCulturaIdRecetaId(culturaCodigo, recetaCodigo);
    }

    @Get(':culturaCodigo/recetas')
    async findRecetasByCulturaId(@Param('culturaCodigo') culturaCodigo: string){
        return await this.culturaRecetaService.findRecetasByCulturaId(culturaCodigo);
    }

    @Put(':culturaCodigo/recetas')
    async associateRecetasCultura(@Body() recetasDto: RecetaDto[], @Param('culturaCodigo') culturaCodigo: string){
        const recetas = plainToInstance(RecetaEntity, recetasDto)
        return await this.culturaRecetaService.associateRecetasCultura(culturaCodigo, recetas);
    }
    
    @Delete(':culturaCodigo/recetas/:recetaCodigo')
    @HttpCode(204)
    async deleteRecetaCultura(@Param('culturaCodigo') culturaCodigo: string, @Param('recetaCodigo') recetaCodigo: string){
        return await this.culturaRecetaService.deleteRecetaCultura(culturaCodigo, recetaCodigo);
    }


}
