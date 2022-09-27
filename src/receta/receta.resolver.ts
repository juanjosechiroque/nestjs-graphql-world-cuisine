import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { plainToInstance } from 'class-transformer';
import { RecetaDto } from './receta.dto';
import { RecetaEntity } from './receta.entity';
import { RecetaService } from './receta.service';


@Resolver()
export class RecetaResolver {

    constructor(private recetaService: RecetaService) {}

    @Query(() => [RecetaEntity])
    recetas(): Promise<RecetaEntity[]> {
        return this.recetaService.findAll();
    }

    @Query(() => RecetaEntity)
    receta(@Args('codigo') codigo: string): Promise<RecetaEntity> {
        return this.recetaService.findOne(codigo);
    }
   
    @Mutation(() => RecetaEntity)
    createReceta(@Args('receta') recetaDto: RecetaDto): Promise<RecetaEntity> {
        const receta = plainToInstance(RecetaEntity, recetaDto);
        return this.recetaService.create(receta);
    }
 
    @Mutation(() => RecetaEntity)
    updateReceta(@Args('codigo') codigo: string, @Args('receta') recetaDto: RecetaDto): Promise<RecetaEntity> {
        const receta = plainToInstance(RecetaEntity, recetaDto);
        return this.recetaService.update(codigo, receta);
    }
 
    @Mutation(() => String)
    deleteReceta(@Args('codigo') codigo: string) {
        this.recetaService.delete(codigo);
        return codigo;
    }

}
