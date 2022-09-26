import { CacheModule, Module } from '@nestjs/common';
import { PaisService } from './pais.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PaisEntity } from './pais.entity';
import { PaisController } from './pais.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PaisEntity]), CacheModule.register({ttl: 30})],
  providers: [PaisService],
  controllers: [PaisController]
})
export class PaisModule {}
