import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { RecetaEntity } from './receta.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Cache } from 'cache-manager';

@Injectable()
export class RecetaService {

    cacheKey: string = "recetas";

    constructor(
        @InjectRepository(RecetaEntity)
        private readonly recetaRepository: Repository<RecetaEntity>,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache 
    ){}

    async findAll(): Promise<RecetaEntity[]> {
        const cached: RecetaEntity[] = await this.cacheManager.get<RecetaEntity[]>(this.cacheKey);

        if(!cached) {
            const recetas: RecetaEntity[] = await this.recetaRepository.find();
            await this.cacheManager.set(this.cacheKey, recetas);
            return recetas;
        }
        return cached;
    }

    async findOne(codigo: string): Promise<RecetaEntity> {
        const receta: RecetaEntity = await this.recetaRepository.findOne({where: {codigo} } );
        if (!receta)
          throw new BusinessLogicException("La receta con el ID dado no fue encontrada", BusinessError.NOT_FOUND);
    
        return receta;
    }    

    async create(receta: RecetaEntity): Promise<RecetaEntity> {
        return await this.recetaRepository.save(receta);
    }

    async update(codigo: string, receta: RecetaEntity): Promise<RecetaEntity> {
        const recetaPersistida: RecetaEntity = await this.recetaRepository.findOne({where:{codigo}});
        if (!recetaPersistida)
          throw new BusinessLogicException("La receta con el ID dado no fue encontrada", BusinessError.NOT_FOUND);
        
        return await this.recetaRepository.save({...recetaPersistida, ...receta});
    }

    async delete(codigo: string) {
        const receta: RecetaEntity = await this.recetaRepository.findOne({where:{codigo}});
        if (!receta)
          throw new BusinessLogicException("La receta con el ID dado no fue encontrada", BusinessError.NOT_FOUND);
      
        await this.recetaRepository.remove(receta);
    }    


}
