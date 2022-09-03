import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaisEntity } from './pais.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class PaisService {

    constructor(
        @InjectRepository(PaisEntity)
        private readonly paisRepository: Repository<PaisEntity>
    ){}

    async findAll(): Promise<PaisEntity[]> {
        return await this.paisRepository.find();
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
