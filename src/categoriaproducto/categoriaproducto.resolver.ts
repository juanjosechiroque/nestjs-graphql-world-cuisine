import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CategoriaproductoService } from './categoriaproducto.service';
import { CategoriaproductoEntity } from './categoriaproducto.entity';
import { plainToInstance } from 'class-transformer';
import { CategoriaproductoDto } from './categoriaproducto.dto';

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
   
    @Mutation(() => CategoriaproductoEntity)
    createCategoriaproducto(@Args('categoriaproducto') categoriaproductoDto: CategoriaproductoDto): Promise<CategoriaproductoEntity> {
        const categoriaproducto = plainToInstance(CategoriaproductoEntity, categoriaproductoDto);
        return this.categoriaproductoService.create(categoriaproducto);
    }
 
    @Mutation(() => CategoriaproductoEntity)
    updateCategoriaproducto(@Args('codigo') codigo: string, @Args('categoriaproducto') categoriaproductoDto: CategoriaproductoDto): Promise<CategoriaproductoEntity> {
        const categoriaproducto = plainToInstance(CategoriaproductoEntity, categoriaproductoDto);
        return this.categoriaproductoService.update(codigo, categoriaproducto);
    }
 
    @Mutation(() => String)
    deleteCategoriaproducto(@Args('codigo') codigo: string) {
        this.categoriaproductoService.delete(codigo);
        return codigo;
    }
 

}