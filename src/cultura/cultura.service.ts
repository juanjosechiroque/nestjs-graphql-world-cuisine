import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CulturaEntity } from './cultura.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Cache } from 'cache-manager';

@Injectable()
export class CulturaService {

    cacheKey: string = "culturas";

    constructor(
        @InjectRepository(CulturaEntity)
        private readonly culturaRepository: Repository<CulturaEntity>,
        @Inject(CACHE_MANAGER) 
        private readonly cacheManager: Cache
    ){}

    async findAll(): Promise<CulturaEntity[]> {
        const cached: CulturaEntity[] = await this.cacheManager.get<CulturaEntity[]>(this.cacheKey);

        if(!cached) {
            const culturas: CulturaEntity[] = await this.culturaRepository.find();
            await this.cacheManager.set(this.cacheKey, culturas);
            return culturas;
        }
        return cached;
    }

    async findOne(id: string): Promise<CulturaEntity> {
        const cultura: CulturaEntity = await this.culturaRepository.findOne({where: {id} } );
        if (!cultura)
          throw new BusinessLogicException("La cultura gastronomica con el ID dado no fue encontrada", BusinessError.NOT_FOUND);
    
        return cultura;
    }    

    async create(cultura: CulturaEntity): Promise<CulturaEntity> {
        return await this.culturaRepository.save(cultura);
    }

    async update(id: string, cultura: CulturaEntity): Promise<CulturaEntity> {
        const culturaPersistida: CulturaEntity = await this.culturaRepository.findOne({where:{id}});
        if (!culturaPersistida)
          throw new BusinessLogicException("La cultura gastronomica con el ID dado no fue encontrada", BusinessError.NOT_FOUND);
        
        return await this.culturaRepository.save({...culturaPersistida, ...cultura});
    }

    async delete(id: string) {
        const cultura: CulturaEntity = await this.culturaRepository.findOne({where:{id}});
        if (!cultura)
          throw new BusinessLogicException("La cultura gastronomica con el ID dado no fue encontrada", BusinessError.NOT_FOUND);
      
        await this.culturaRepository.remove(cultura);
    }    


}
