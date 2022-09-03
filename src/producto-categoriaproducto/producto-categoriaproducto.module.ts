import { Module } from '@nestjs/common';
import { ProductoCategoriaproductoService } from './producto-categoriaproducto.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { CategoriaproductoEntity } from '../categoriaproducto/categoriaproducto.entity';

@Module({
  imports: [TypeOrmModule.forFeature([ProductoEntity, CategoriaproductoEntity])],
    providers: [ProductoCategoriaproductoService]
})
export class ProductoCategoriaproductoModule {}
