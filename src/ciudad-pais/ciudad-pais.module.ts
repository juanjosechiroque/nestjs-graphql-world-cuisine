import { Module } from '@nestjs/common';
import { CiudadPaisService } from './ciudad-pais.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { PaisEntity } from '../pais/pais.entity';
import { CiudadPaisController } from './ciudad-pais.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CiudadEntity, PaisEntity])],
    providers: [CiudadPaisService],
    controllers: [CiudadPaisController]
})
export class CiudadPaisModule {}
