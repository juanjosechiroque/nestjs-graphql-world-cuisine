import { CacheModule, Module } from '@nestjs/common';
import { CiudadService } from './ciudad.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CiudadEntity } from './ciudad.entity';
import { CiudadController } from './ciudad.controller';
import { CiudadResolver } from './ciudad.resolver';

@Module({
  imports: [TypeOrmModule.forFeature([CiudadEntity]), CacheModule.register({ttl: 30})],
  providers: [CiudadService, CiudadResolver],
  controllers: [CiudadController]
})
export class CiudadModule {}
