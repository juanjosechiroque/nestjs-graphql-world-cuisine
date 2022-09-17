import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseGuards, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { JwtAuthGuard } from 'src/auth/guards/jwt-auth.guard';
import { RolesGuard } from 'src/auth/guards/roles.guard';
import { HasRoles } from '../user/roles.decorator';
import { Role } from '../user/role.enum';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CulturaDto } from './cultura.dto';
import { CulturaEntity } from './cultura.entity';
import { CulturaService } from './cultura.service';

@Controller('culturas') 
@UseGuards(JwtAuthGuard, RolesGuard)
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaController {
    constructor(private readonly culturaService: CulturaService) {}

  @Get()
  @HasRoles(Role.ADMIN,Role.READER)
  async findAll() {
    return await this.culturaService.findAll();
  }

  @Get(':culturaCodigo')
  @HasRoles(Role.ADMIN,Role.READER)
  async findOne(@Param('culturaCodigo') culturaCodigo: string) {
    return await this.culturaService.findOne(culturaCodigo);
  }

  @Post()
  @HasRoles(Role.ADMIN)
  async create(@Body() culturaDto: CulturaDto) {
    const ciudad: CulturaEntity = plainToInstance(CulturaEntity, culturaDto);
    return await this.culturaService.create(ciudad);
  }

  @Put(':culturaCodigo')
  @HasRoles(Role.ADMIN)
  async update(@Param('culturaCodigo') culturaCodigo: string, @Body() culturaDto: CulturaDto) {
    const cultura: CulturaEntity = plainToInstance(CulturaEntity, culturaDto);
    return await this.culturaService.update(culturaCodigo, cultura);
  }

  @Delete(':culturaCodigo')
  @HttpCode(204)
  @HasRoles(Role.ADMIN)
  async delete(@Param('culturaCodigo') culturaCodigo: string) {
    return await this.culturaService.delete(culturaCodigo);
  }

}
