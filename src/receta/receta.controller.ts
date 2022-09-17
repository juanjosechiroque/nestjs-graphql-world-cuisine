import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { HasRoles } from '../user/roles.decorator';
import { Role } from '../user/role.enum';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { RecetaDto } from './receta.dto';
import { RecetaEntity } from './receta.entity';
import { RecetaService } from './receta.service';


@Controller('recetas')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(BusinessErrorsInterceptor)
export class RecetaController {

    constructor(private readonly recetaService: RecetaService) {}

  @Get()
  @HasRoles(Role.ADMIN,Role.READER)
  async findAll() {
    return await this.recetaService.findAll();
  }

  @Get(':recetaCodigo')
  @HasRoles(Role.ADMIN,Role.READER)
  async findOne(@Param('recetaCodigo') recetaCodigo: string) {
    return await this.recetaService.findOne(recetaCodigo);
  }

  @Post()
  @HasRoles(Role.ADMIN)
  async create(@Body() RecetaDto: RecetaDto) {
    const receta: RecetaEntity = plainToInstance(RecetaEntity, RecetaDto);
    return await this.recetaService.create(receta);
  }

  @Put(':recetaCodigo')
  @HasRoles(Role.ADMIN)
  async update(@Param('recetaCodigo') recetaCodigo: string, @Body() RecetaDto: RecetaDto) {
    const receta: RecetaEntity = plainToInstance(RecetaEntity, RecetaDto);
    return await this.recetaService.update(recetaCodigo, receta);
  }

  @Delete(':recetaCodigo')
  @HttpCode(204)
  @HasRoles(Role.ADMIN)
  async delete(@Param('recetaCodigo') recetaCodigo: string) {
    return await this.recetaService.delete(recetaCodigo);
  }

}
