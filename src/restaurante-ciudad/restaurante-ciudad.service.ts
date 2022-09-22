import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { Cache } from 'cache-manager';

@Injectable()
export class RestauranteCiudadService {

    cacheKey: string = "restaurante-ciudad-";

    constructor(
        @InjectRepository(RestauranteEntity)
        private readonly restauranteRepository: Repository<RestauranteEntity>,
     
        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ) {}

    async addCiudadRestaurante(codigoRestaurante: string, codigoCiudad: string): Promise<RestauranteEntity> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {codigo: codigoCiudad}});
        if (!ciudad)
          throw new BusinessLogicException("La ciudad con el ID dado no fue encontrada", BusinessError.NOT_FOUND);
       
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {codigo: codigoRestaurante}, relations: ["ciudad"]}) 
        if (!restaurante)
          throw new BusinessLogicException("El restaurante con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
     
        restaurante.ciudad = ciudad;
        return await this.restauranteRepository.save(restaurante);
      }
     
    async findCiudadByRestauranteIdCiudadId(codigoRestaurante: string, codigoCiudad: string): Promise<CiudadEntity> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {codigo: codigoCiudad}});
        if (!ciudad)
          throw new BusinessLogicException("La ciudad con el ID dado no fue encontrada", BusinessError.NOT_FOUND)
        
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {codigo: codigoRestaurante}, relations: ["ciudad"]}) 
        if (!restaurante)
          throw new BusinessLogicException("El restaurante con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
    
        if (restaurante.ciudad.codigo != ciudad.codigo)
          throw new BusinessLogicException("La ciudad con el ID dado no esta asociada al restaurante", BusinessError.PRECONDITION_FAILED)
    
        return restaurante.ciudad;
    }
     
    async findCiudadByRestauranteId(codigoRestaurante: string): Promise<CiudadEntity> {

        const cached: CiudadEntity = await this.cacheManager.get<CiudadEntity>(this.cacheKey + codigoRestaurante);

        if (!cached) {
            const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {codigo: codigoRestaurante}, relations: ["ciudad"]});

            if (!restaurante)
                throw new BusinessLogicException("El restaurante con el ID dado no fue encontrado", BusinessError.NOT_FOUND)

            await this.cacheManager.set(this.cacheKey + codigoRestaurante, restaurante.ciudad);
            return restaurante.ciudad;
        }
        
        return cached;
    }
     
    async associateCiudadRestaurante(codigoRestaurante: string, newCiudadId: string): Promise<RestauranteEntity> {
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {codigo: codigoRestaurante}, relations: ["ciudad"]});
        if (!restaurante)
          throw new BusinessLogicException("El restaurante con el ID dado no fue encontrado", BusinessError.NOT_FOUND);

        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {codigo: newCiudadId}});
        if (!ciudad)
            throw new BusinessLogicException("La ciudad con el ID dado no fue encontrada", BusinessError.NOT_FOUND)
        
        restaurante.ciudad = ciudad;
        return await this.restauranteRepository.save(restaurante);
      }
     
    async deleteCiudadRestaurante(codigoRestaurante: string, codigoCiudad: string){
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {codigo: codigoCiudad}});
        if (!ciudad)
          throw new BusinessLogicException("La ciudad con el ID dado no fue encontrada", BusinessError.NOT_FOUND)
        
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {codigo: codigoRestaurante}, relations: ["ciudad"]}) 
        if (!restaurante)
          throw new BusinessLogicException("El restaurante con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
    
        if (restaurante.ciudad.codigo != ciudad.codigo)
          throw new BusinessLogicException("La ciudad con el ID dado no esta asociada al restaurante", BusinessError.PRECONDITION_FAILED)

        restaurante.ciudad = null;
        await this.restauranteRepository.save(restaurante);
    }

}
