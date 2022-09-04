import { Module } from '@nestjs/common';
import { CulturaPaisService } from './cultura-pais.service';
import { CulturaEntity } from '../cultura/cultura.entity';
import { PaisEntity } from '../pais/pais.entity';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [TypeOrmModule.forFeature([CulturaEntity, PaisEntity])],
  providers: [CulturaPaisService]
})
export class CulturaPaisModule {}
