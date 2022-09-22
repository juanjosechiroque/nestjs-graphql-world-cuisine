import { CacheModule, Module } from '@nestjs/common';
import { RestauranteService } from './restaurante.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestauranteEntity } from './restaurante.entity';
import { RestauranteController } from './restaurante.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RestauranteEntity]), CacheModule.register({ttl: 30})],
  providers: [RestauranteService],
  controllers: [RestauranteController]
})
export class RestauranteModule {}
