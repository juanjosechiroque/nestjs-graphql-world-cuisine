import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RestauranteEntity } from './restaurante.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Cache } from 'cache-manager';

@Injectable()
export class RestauranteService {

    cacheKey: string = "restaurantes";

    constructor(
        @InjectRepository(RestauranteEntity)
        private readonly restauranteRepository: Repository<RestauranteEntity>,
        @Inject(CACHE_MANAGER)
       private readonly cacheManager: Cache
    ){}

    async findAll(): Promise<RestauranteEntity[]> {
        const cached: RestauranteEntity[] = await this.cacheManager.get<RestauranteEntity[]>(this.cacheKey);

        if (!cached){
            const restaurantes: RestauranteEntity[] = await this.restauranteRepository.find();
            await this.cacheManager.set(this.cacheKey, restaurantes);
            return restaurantes;
        }

        return cached;
    }

    async findOne(codigo: string): Promise<RestauranteEntity> {
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {codigo} } );
        if (!restaurante)
          throw new BusinessLogicException("El restaurante con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
    
        return restaurante;
    }    

    async create(restaurante: RestauranteEntity): Promise<RestauranteEntity> {
        return await this.restauranteRepository.save(restaurante);
    }

    async update(codigo: string, restaurante: RestauranteEntity): Promise<RestauranteEntity> {
        const restaurantePersistido: RestauranteEntity = await this.restauranteRepository.findOne({where:{codigo}});
        if (!restaurantePersistido)
          throw new BusinessLogicException("El restaurante con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
        
        return await this.restauranteRepository.save({...restaurantePersistido, ...restaurante});
    }

    async delete(codigo: string) {
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where:{codigo}});
        if (!restaurante)
          throw new BusinessLogicException("El restaurante con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
      
        await this.restauranteRepository.remove(restaurante);
    }    


}
