/* eslint-disable prettier/prettier */
import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { HasRoles } from '../user/roles.decorator';
import { Role } from '../user/role.enum';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { PaisDto } from './pais.dto';
import { PaisEntity } from './pais.entity';
import { PaisService } from './pais.service';

@Controller('paises')
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(BusinessErrorsInterceptor)
export class PaisController {
    constructor(private readonly paisService: PaisService) {}

  @Get()
  @HasRoles(Role.ADMIN,Role.READER)
  async findAll() {
    return await this.paisService.findAll();
  }

  @Get(':paisCodigo')
  @HasRoles(Role.ADMIN,Role.READER)
  async findOne(@Param('paisCodigo') paisCodigo: string) {
    return await this.paisService.findOne(paisCodigo);
  }

  @Post()
  @HasRoles(Role.ADMIN)
  async create(@Body() paisDto: PaisDto) {
    const pais: PaisEntity = plainToInstance(PaisEntity, paisDto);
    return await this.paisService.create(pais);
  }

  @Put(':paisCodigo')
  @HasRoles(Role.ADMIN)
  async update(@Param('paisCodigo') paisCodigo: string, @Body() paisDto: PaisDto) {
    const pais: PaisEntity = plainToInstance(PaisEntity, paisDto);
    return await this.paisService.update(paisCodigo, pais);
  }

  @Delete(':paisCodigo')
  @HttpCode(204)
  @HasRoles(Role.ADMIN)
  async delete(@Param('paisCodigo') paisCodigo: string) {
    return await this.paisService.delete(paisCodigo);
  }

}
