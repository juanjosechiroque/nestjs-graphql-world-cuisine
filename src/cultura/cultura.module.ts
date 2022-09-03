import { Module } from '@nestjs/common';
import { CulturaService } from './cultura.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaEntity } from './cultura.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CulturaEntity])],
  providers: [CulturaService]
})
export class CulturaModule {}
