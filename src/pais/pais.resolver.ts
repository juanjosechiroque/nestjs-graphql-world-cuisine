import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { PaisService } from './pais.service';
import { PaisEntity } from './pais.entity';
import { plainToInstance } from 'class-transformer';
import { PaisDto } from './pais.dto';

@Resolver()
export class PaisResolver {
    constructor(private paisService: PaisService) {}

    @Query(() => [PaisEntity])
    paiss(): Promise<PaisEntity[]> {
        return this.paisService.findAll();
    }

    @Query(() => PaisEntity)
    pais(@Args('codigo') codigo: string): Promise<PaisEntity> {
        return this.paisService.findOne(codigo);
    }
   
    @Mutation(() => PaisEntity)
    createPais(@Args('pais') paisDto: PaisDto): Promise<PaisEntity> {
        const pais = plainToInstance(PaisEntity, paisDto);
        return this.paisService.create(pais);
    }
 
    @Mutation(() => PaisEntity)
    updatePais(@Args('codigo') codigo: string, @Args('pais') paisDto: PaisDto): Promise<PaisEntity> {
        const pais = plainToInstance(PaisEntity, paisDto);
        return this.paisService.update(codigo, pais);
    }
 
    @Mutation(() => String)
    deletePais(@Args('codigo') codigo: string) {
        this.paisService.delete(codigo);
        return codigo;
    }
 }