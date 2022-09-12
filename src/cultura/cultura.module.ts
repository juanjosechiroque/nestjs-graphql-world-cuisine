import { Module } from '@nestjs/common';
import { CulturaService } from './cultura.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaEntity } from './cultura.entity';
import { CulturaController } from './cultura.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CulturaEntity])],
  providers: [CulturaService],
  controllers: [CulturaController]
})
export class CulturaModule {}
