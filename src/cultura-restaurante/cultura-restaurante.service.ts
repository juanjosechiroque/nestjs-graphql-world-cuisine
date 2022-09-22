import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CulturaEntity } from '../cultura/cultura.entity';
import { Cache } from 'cache-manager';

@Injectable()
export class CulturaRestauranteService {

    cacheKey: string = "cultura-restaurante-";

    constructor(
        @InjectRepository(CulturaEntity)
        private readonly culturaRepository: Repository<CulturaEntity>,

        @InjectRepository(RestauranteEntity)
        private readonly restauranteRepository: Repository<RestauranteEntity>,
        
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache

    ) { }

    async addRestauranteCultura(codigoCultura: string, codigoRestaurante: string): Promise<CulturaEntity>{

        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({ where: { codigo: codigoRestaurante } });
        if (!restaurante)
            throw new BusinessLogicException("El restaurante con el ID dado no fue encontrado", BusinessError.NOT_FOUND);

        const cultura: CulturaEntity = await this.culturaRepository.findOne({ where: { id: codigoCultura }, relations: ["paises", "recetas", "restaurantes", "productos"] })
        if (!cultura)
            throw new BusinessLogicException("La cultura gastronómica con el ID dado no fue encontrada", BusinessError.NOT_FOUND);

        cultura.restaurantes = [...cultura.restaurantes, restaurante];
        return await this.culturaRepository.save(cultura);

    }

    async findRestauranteByCulturaIdRestauranteId(codigoCultura: string, codigoRestaurante: string): Promise<RestauranteEntity> {
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({ where: { codigo: codigoRestaurante } });

        if (!restaurante)
            throw new BusinessLogicException("El restaurante con el ID dado no fue encontrado", BusinessError.NOT_FOUND)

        const cultura: CulturaEntity = await this.culturaRepository.findOne({ where: { id: codigoCultura }, relations: ["restaurantes"] });
        if (!cultura)
            throw new BusinessLogicException("La cultura gastronómica con el ID dado no fue encontrado", BusinessError.NOT_FOUND)

        const culturaRestaurante: RestauranteEntity = cultura.restaurantes.find(e => e.codigo === restaurante.codigo);

        if (!culturaRestaurante)
            throw new BusinessLogicException("El restaurante con el ID dado no se encuentra asociado a la cultura gastronómica", BusinessError.PRECONDITION_FAILED)

        return culturaRestaurante;
    }

    async findRestaurantesByCulturaId(codigoCultura: string): Promise<RestauranteEntity[]> {
        const cached: RestauranteEntity[] = await this.cacheManager.get<RestauranteEntity[]>(this.cacheKey + codigoCultura);

        if (!cached) {
            const cultura: CulturaEntity = await this.culturaRepository.findOne({ where: { id: codigoCultura }, relations: ["restaurantes"] });
        
            if (!cultura)
                throw new BusinessLogicException("La cultura gastronómica con el ID dado no fue encontrado", BusinessError.NOT_FOUND)

            await this.cacheManager.set(this.cacheKey + codigoCultura, cultura.restaurantes);
            return cultura.restaurantes;
        }

        return cached;
    }

    async associateRestaurantesCultura(codigoCultura: string, restaurantes: RestauranteEntity[]): Promise<CulturaEntity> {
        const cultura: CulturaEntity = await this.culturaRepository.findOne({where: {id: codigoCultura}, relations: ["restaurantes"]});
    
        if (!cultura)
          throw new BusinessLogicException("La cultura gastronómica con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < restaurantes.length; i++) {
          const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {codigo: restaurantes[i].codigo}});
          if (!restaurante)
            throw new BusinessLogicException("El restaurantes con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
        }
    
        cultura.restaurantes = restaurantes;
        return await this.culturaRepository.save(cultura);
    }


    async deleteRestauranteCultura(codigoCultura: string, codigoRestaurante: string){
        const restaurante: RestauranteEntity = await this.restauranteRepository.findOne({where: {codigo: codigoRestaurante}});
        if (!restaurante)
          throw new BusinessLogicException("El restaurante con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
    
        const cultura: CulturaEntity = await this.culturaRepository.findOne({where: {id: codigoCultura}, relations: ["restaurantes"]});
        if (!cultura)
          throw new BusinessLogicException("La cultura gastronómica con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
    
        const culturaRestaurante: RestauranteEntity = cultura.restaurantes.find(e => e.codigo === restaurante.codigo);
    
        if (!culturaRestaurante)
            throw new BusinessLogicException("El restaurante con el ID dado no se encuentra asociado a la cultura gastronómica", BusinessError.PRECONDITION_FAILED)
 
        cultura.restaurantes = cultura.restaurantes.filter(e => e.codigo !== codigoRestaurante);
        await this.culturaRepository.save(cultura);
    } 



}
