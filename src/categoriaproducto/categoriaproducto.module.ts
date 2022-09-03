import { Module } from '@nestjs/common';
import { CategoriaproductoService } from './categoriaproducto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaproductoEntity } from './categoriaproducto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CategoriaproductoEntity])],
  providers: [CategoriaproductoService]
})
export class CategoriaproductoModule {}
