import { Module } from '@nestjs/common';
import { CategoriaproductoService } from './categoriaproducto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaproductoEntity } from './categoriaproducto.entity';
import { CategoriaproductoController } from './categoriaproducto.controller';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriaproductoEntity])],
  providers: [CategoriaproductoService],
  controllers: [CategoriaproductoController]
})
export class CategoriaproductoModule {}
