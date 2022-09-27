import { CacheModule, Module } from '@nestjs/common';
import { PaisService } from './pais.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaisEntity } from './pais.entity';
import { PaisController } from './pais.controller';
import { PaisResolver } from './pais.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([PaisEntity]), CacheModule.register({ttl: 30})],
  providers: [PaisService, PaisResolver],
  controllers: [PaisController]
})
export class PaisModule {}
