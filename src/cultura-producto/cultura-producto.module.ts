import { CacheModule, Module } from '@nestjs/common';
import { CulturaProductoService } from './cultura-producto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CulturaEntity } from '../cultura/cultura.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { CulturaProductoController } from './cultura-producto.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CulturaEntity, ProductoEntity]), CacheModule.register({ttl: 30})],
  providers: [CulturaProductoService],
  controllers: [CulturaProductoController]
})
export class CulturaProductoModule {}
