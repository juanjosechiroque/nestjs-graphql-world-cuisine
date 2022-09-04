import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Repository } from 'typeorm';
import { CulturaEntity } from '../cultura/cultura.entity';

@Injectable()
export class CulturaRestauranteService {

    constructor(
        @InjectRepository(CulturaEntity)
        private readonly culturaRepository: Repository<CulturaEntity>,

        @InjectRepository(RestauranteEntity)
        private readonly restauranteRepository: Repository<RestauranteEntity>

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



}
