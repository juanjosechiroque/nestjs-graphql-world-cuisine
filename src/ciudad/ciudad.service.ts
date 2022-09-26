import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CiudadEntity } from './ciudad.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Cache } from 'cache-manager';

@Injectable()
export class CiudadService {

    cacheKey: string = "ciudades";

    constructor(
        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache        
    ){}

    async findAll(): Promise<CiudadEntity[]> {

        const cached: CiudadEntity[] = await this.cacheManager.get<CiudadEntity[]>(this.cacheKey);

        if(!cached) {
            const ciudades: CiudadEntity[] = await this.ciudadRepository.find();
            await this.cacheManager.set(this.cacheKey, ciudades);
            return ciudades;
        }
        return cached;

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
