import { Module, CacheModule } from '@nestjs/common';
import { CulturaService } from './cultura.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaEntity } from './cultura.entity';
import { CulturaController } from './cultura.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CulturaEntity]), CacheModule.register({ttl: 30})],
  providers: [CulturaService],
  controllers: [CulturaController]
})
export class CulturaModule {}
