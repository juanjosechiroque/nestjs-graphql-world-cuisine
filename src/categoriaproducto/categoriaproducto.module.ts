import { Module } from '@nestjs/common';
import { CategoriaproductoService } from './categoriaproducto.service';

@Module({
  providers: [CategoriaproductoService]
})
export class CategoriaproductoModule {}
