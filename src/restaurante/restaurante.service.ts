import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RestauranteEntity } from './restaurante.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class RestauranteService {

    constructor(
        @InjectRepository(RestauranteEntity)
        private readonly restauranteRepository: Repository<RestauranteEntity>
    ){}

    async findAll(): Promise<RestauranteEntity[]> {
        return await this.restauranteRepository.find();
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
