import { Module, CacheModule } from '@nestjs/common';
import { CulturaService } from './cultura.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaEntity } from './cultura.entity';
import { CulturaController } from './cultura.controller';
import { CulturaResolver } from './cultura.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CulturaEntity]), CacheModule.register({ttl: 30})],
  providers: [CulturaService, CulturaResolver],
  controllers: [CulturaController]
})
export class CulturaModule {}
