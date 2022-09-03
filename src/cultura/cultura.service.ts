import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CulturaEntity } from './cultura.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class CulturaService {

    constructor(
        @InjectRepository(CulturaEntity)
        private readonly culturaRepository: Repository<CulturaEntity>
    ){}

    async findAll(): Promise<CulturaEntity[]> {
        return await this.culturaRepository.find();
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
