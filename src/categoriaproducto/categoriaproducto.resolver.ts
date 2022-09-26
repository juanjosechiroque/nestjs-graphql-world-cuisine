import { Args, Query, Resolver } from '@nestjs/graphql';
import { CategoriaproductoService } from './categoriaproducto.service';
import { CategoriaproductoEntity } from './categoriaproducto.entity';

@Resolver()
export class CategoriaproductoResolver {
    constructor(private categoriaproductoService: CategoriaproductoService) {}

    @Query(() => [CategoriaproductoEntity])
    categoriaproductos(): Promise<CategoriaproductoEntity[]> {
        return this.categoriaproductoService.findAll();
    }

    @Query(() => CategoriaproductoEntity)
    categoriaproducto(@Args('codigo') codigo: string): Promise<CategoriaproductoEntity> {
        return this.categoriaproductoService.findOne(codigo);
    }
   
}