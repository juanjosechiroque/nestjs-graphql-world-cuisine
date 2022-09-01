import { Module } from '@nestjs/common';
import { ProductoCategoriaproductoService } from './producto-categoriaproducto.service';

@Module({
  providers: [ProductoCategoriaproductoService]
})
export class ProductoCategoriaproductoModule {}
