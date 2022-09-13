import { Body, Controller, Delete, Get, HttpCode, Param, Post, Put, UseInterceptors } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { BusinessErrorsInterceptor } from '../shared/interceptors/business-errors.interceptor';
import { CulturaDto } from './cultura.dto';
import { CulturaEntity } from './cultura.entity';
import { CulturaService } from './cultura.service';

@Controller('culturas')
@UseInterceptors(BusinessErrorsInterceptor)
export class CulturaController {
    constructor(private readonly culturaService: CulturaService) {}

  @Get()
  async findAll() {
    return await this.culturaService.findAll();
  }

  @Get(':culturaCodigo')
  async findOne(@Param('culturaCodigo') culturaCodigo: string) {
    return await this.culturaService.findOne(culturaCodigo);
  }

  @Post()
  async create(@Body() culturaDto: CulturaDto) {
    const ciudad: CulturaEntity = plainToInstance(CulturaEntity, culturaDto);
    return await this.culturaService.create(ciudad);
  }

  @Put(':culturaCodigo')
  async update(@Param('culturaCodigo') culturaCodigo: string, @Body() culturaDto: CulturaDto) {
    const cultura: CulturaEntity = plainToInstance(CulturaEntity, culturaDto);
    return await this.culturaService.update(culturaCodigo, cultura);
  }

  @Delete(':culturaCodigo')
  @HttpCode(204)
  async delete(@Param('culturaCodigo') culturaCodigo: string) {
    return await this.culturaService.delete(culturaCodigo);
  }

}
