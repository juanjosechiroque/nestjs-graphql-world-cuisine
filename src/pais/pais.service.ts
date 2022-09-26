import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaisEntity } from './pais.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Cache } from 'cache-manager';

@Injectable()
export class PaisService {

    cacheKey: string = "paises";

    constructor(
        @InjectRepository(PaisEntity)
        private readonly paisRepository: Repository<PaisEntity>,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache        
    ){}

    async findAll(): Promise<PaisEntity[]> {

        const cached: PaisEntity[] = await this.cacheManager.get<PaisEntity[]>(this.cacheKey);

        if(!cached) {
            const paises: PaisEntity[] = await this.paisRepository.find();
            await this.cacheManager.set(this.cacheKey, paises);
            return paises;
        }
        return cached;

    }

    async findOne(codigo: string): Promise<PaisEntity> {
        const pais: PaisEntity = await this.paisRepository.findOne({where: {codigo} } );
        if (!pais)
          throw new BusinessLogicException("El pais con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
    
        return pais;
    }    

    async create(pais: PaisEntity): Promise<PaisEntity> {
        return await this.paisRepository.save(pais);
    }

    async update(codigo: string, pais: PaisEntity): Promise<PaisEntity> {
        const paisPersistido: PaisEntity = await this.paisRepository.findOne({where:{codigo}});
        if (!paisPersistido)
          throw new BusinessLogicException("El pais con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
        
        return await this.paisRepository.save({...paisPersistido, ...pais});
    }

    async delete(codigo: string) {
        const pais: PaisEntity = await this.paisRepository.findOne({where:{codigo}});
        if (!pais)
          throw new BusinessLogicException("El pais con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
      
        await this.paisRepository.remove(pais);
    }    


}
