import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { RestauranteDto } from './restaurante.dto';
import { RestauranteEntity } from './restaurante.entity';
import { RestauranteService } from './restaurante.service';

@Resolver()
export class RestauranteResolver {

    constructor (private restauranteService: RestauranteService) {}

    @Query(() => [RestauranteEntity])
    restaurantes(): Promise<RestauranteEntity[]> {
        return this.restauranteService.findAll();
    }

    @Query(() => RestauranteEntity)
    restaurante(@Args('codigo') codigo: string): Promise<RestauranteEntity> {
        return this.restauranteService.findOne(codigo);
    }

    @Mutation(() => RestauranteEntity)
    createRestaurante(@Args('restaurante') restauranteDto: RestauranteDto): Promise<RestauranteEntity> {
        const restaurante = plainToInstance(RestauranteEntity, restauranteDto);
        return this.restauranteService.create(restaurante);
    }

    @Mutation(() => RestauranteEntity)
    updateRestaurante(@Args('codigo') codigo: string, @Args('restaurante') restauranteDto: RestauranteDto): Promise<RestauranteEntity> {
        const restaurante = plainToInstance(RestauranteEntity, restauranteDto);
        return this.restauranteService.update(codigo, restaurante);
    }

    @Mutation(() => String)
    deleteRestaurante(@Args('codigo') codigo: string) {
        this.restauranteService.delete(codigo);
        return codigo;
    }

}
