import { CacheModule, Module } from '@nestjs/common';
import { RecetaService } from './receta.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RecetaEntity } from './receta.entity';
import { RecetaController } from './receta.controller';
import { RecetaResolver } from './receta.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([RecetaEntity]), CacheModule.register({ttl: 30})],
  providers: [RecetaService, RecetaResolver],
  controllers: [RecetaController]
})
export class RecetaModule {}
