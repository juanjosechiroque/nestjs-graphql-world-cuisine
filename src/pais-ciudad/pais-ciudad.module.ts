import { CacheModule, Module } from '@nestjs/common';
import { PaisCiudadService } from './pais-ciudad.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaisEntity } from '../pais/pais.entity';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { PaisCiudadController } from './pais-ciudad.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaisEntity, CiudadEntity]), CacheModule.register({ttl: 30})],
  providers: [PaisCiudadService],
  controllers: [PaisCiudadController]
})
export class PaisCiudadModule {}
