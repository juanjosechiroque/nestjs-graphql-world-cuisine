import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CiudadEntity } from './ciudad.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class CiudadService {

    constructor(
        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>
    ){}

    async findAll(): Promise<CiudadEntity[]> {
        return await this.ciudadRepository.find();
    }

    async findOne(codigo: string): Promise<CiudadEntity> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {codigo} } );
        if (!ciudad)
          throw new BusinessLogicException("La ciudad con el ID dado no fue encontrada", BusinessError.NOT_FOUND);
    
        return ciudad;
    }    

    async create(ciudad: CiudadEntity): Promise<CiudadEntity> {
        return await this.ciudadRepository.save(ciudad);
    }

    async update(codigo: string, ciudad: CiudadEntity): Promise<CiudadEntity> {
        const ciudadPersistida: CiudadEntity = await this.ciudadRepository.findOne({where:{codigo}});
        if (!ciudadPersistida)
          throw new BusinessLogicException("La ciudad con el ID dado no fue encontrada", BusinessError.NOT_FOUND);
        
        return await this.ciudadRepository.save({...ciudadPersistida, ...ciudad});
    }

    async delete(codigo: string) {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where:{codigo}});
        if (!ciudad)
          throw new BusinessLogicException("La ciudad con el ID dado no fue encontrada", BusinessError.NOT_FOUND);
      
        await this.ciudadRepository.remove(ciudad);
    }    


}
