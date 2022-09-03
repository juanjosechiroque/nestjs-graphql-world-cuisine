import { Module } from '@nestjs/common';
import { PaisService } from './pais.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaisEntity } from './pais.entity';

@Module({
  imports: [TypeOrmModule.forFeature([PaisEntity])],
  providers: [PaisService]
})
export class PaisModule {}
