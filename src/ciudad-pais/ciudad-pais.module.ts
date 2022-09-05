import { Module } from '@nestjs/common';
import { CiudadPaisService } from './ciudad-pais.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { PaisEntity } from '../pais/pais.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CiudadEntity, PaisEntity])],
    providers: [CiudadPaisService]
})
export class CiudadPaisModule {}
