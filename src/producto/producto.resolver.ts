import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { ProductoService } from './producto.service';
import { ProductoEntity } from './producto.entity';
import { plainToInstance } from 'class-transformer';
import { ProductoDto } from './producto.dto';

@Resolver()
export class ProductoResolver {
    constructor(private productoService: ProductoService) {}

    @Query(() => [ProductoEntity])
    productos(): Promise<ProductoEntity[]> {
        return this.productoService.findAll();
    }

    @Query(() => ProductoEntity)
    producto(@Args('codigo') codigo: string): Promise<ProductoEntity> {
        return this.productoService.findOne(codigo);
    }
   
    @Mutation(() => ProductoEntity)
    createProducto(@Args('producto') productoDto: ProductoDto): Promise<ProductoEntity> {
        const producto = plainToInstance(ProductoEntity, productoDto);
        return this.productoService.create(producto);
    }
 
    @Mutation(() => ProductoEntity)
    updateProducto(@Args('codigo') codigo: string, @Args('producto') productoDto: ProductoDto): Promise<ProductoEntity> {
        const producto = plainToInstance(ProductoEntity, productoDto);
        return this.productoService.update(codigo, producto);
    }
 
    @Mutation(() => String)
    deleteProducto(@Args('codigo') codigo: string) {
        this.productoService.delete(codigo);
        return codigo;
    }
 

}