import { Args, Mutation, Query, Resolver } from '@nestjs/graphql';
import { CiudadService } from './ciudad.service';
import { CiudadEntity } from './ciudad.entity';
import { plainToInstance } from 'class-transformer';
import { CiudadDto } from './ciudad.dto';

@Resolver()
export class CiudadResolver {
    constructor(private ciudadService: CiudadService) {}

    @Query(() => [CiudadEntity])
    ciudades(): Promise<CiudadEntity[]> {
        return this.ciudadService.findAll();
    }

    @Query(() => CiudadEntity)
    ciudad(@Args('codigo') codigo: string): Promise<CiudadEntity> {
        return this.ciudadService.findOne(codigo);
    }
   
    @Mutation(() => CiudadEntity)
    createCiudad(@Args('ciudad') ciudadDto: CiudadDto): Promise<CiudadEntity> {
        const ciudad = plainToInstance(CiudadEntity, ciudadDto);
        return this.ciudadService.create(ciudad);
    }
 
    @Mutation(() => CiudadEntity)
    updateCiudad(@Args('codigo') codigo: string, @Args('ciudad') ciudadDto: CiudadDto): Promise<CiudadEntity> {
        const ciudad = plainToInstance(CiudadEntity, ciudadDto);
        return this.ciudadService.update(codigo, ciudad);
    }
 
    @Mutation(() => String)
    deleteCiudad(@Args('codigo') codigo: string) {
        this.ciudadService.delete(codigo);
        return codigo;
    }
 

}