import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CulturaEntity } from '../cultura/cultura.entity';
import { PaisEntity } from '../pais/pais.entity';
import { Repository } from 'typeorm';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';
import { Cache } from 'cache-manager';

@Injectable()
export class CulturaPaisService {

    cacheKey: string = "cultura-pais-";

    constructor(
        @InjectRepository(CulturaEntity)
        private readonly culturaRepository: Repository<CulturaEntity>,

        @InjectRepository(PaisEntity)
        private readonly paisRepository: Repository<PaisEntity>,

        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ) { }

    async addPaisCultura(codigoCultura: string, codigoPais: string): Promise<CulturaEntity> {
        const pais: PaisEntity = await this.paisRepository.findOne({ where: { codigo: codigoPais } });
        if (!pais)
            throw new BusinessLogicException("El país con el ID dado no fue encontrado", BusinessError.NOT_FOUND);

        const cultura: CulturaEntity = await this.culturaRepository.findOne({ where: { id: codigoCultura }, relations: ["paises", "recetas", "restaurantes", "productos"] })
        if (!cultura)
            throw new BusinessLogicException("La cultura gastronómica con el ID dado no fue encontrada", BusinessError.NOT_FOUND);

        cultura.paises = [...cultura.paises, pais];
        return await this.culturaRepository.save(cultura);
    }

    async findPaisByCulturaIdPaisId(codigoCultura: string, codigoPais: string): Promise<PaisEntity> {
        const pais: PaisEntity = await this.paisRepository.findOne({ where: { codigo: codigoPais } });
        if (!pais)
            throw new BusinessLogicException("El país con el ID dado no fue encontrado", BusinessError.NOT_FOUND)

        const cultura: CulturaEntity = await this.culturaRepository.findOne({ where: { id: codigoCultura }, relations: ["paises"] });
        if (!cultura)
            throw new BusinessLogicException("La cultura gastronómica con el ID dado no fue encontrado", BusinessError.NOT_FOUND)

        const culturaPais: PaisEntity = cultura.paises.find(e => e.codigo === pais.codigo);

        if (!culturaPais)
            throw new BusinessLogicException("El pais con el ID dado no se encuentra asociado a la cultura gastronómica", BusinessError.PRECONDITION_FAILED)

        return culturaPais;
    }

    async findPaisesByCulturaId(codigoCultura: string): Promise<PaisEntity[]> {
        const cached: PaisEntity[] = await this.cacheManager.get<PaisEntity[]>(this.cacheKey + codigoCultura);

        if (!cached) {
            const cultura: CulturaEntity = await this.culturaRepository.findOne({ where: { id: codigoCultura }, relations: ["paises"] });
            if (!cultura)
                throw new BusinessLogicException("La cultura gastronómica con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
            
            await this.cacheManager.set(this.cacheKey + codigoCultura, cultura.paises);
            return cultura.paises;
        }

        return cached;
    }

    async associatePaisesCultura(codigoCultura: string, paises: PaisEntity[]): Promise<CulturaEntity> {
        const cultura: CulturaEntity = await this.culturaRepository.findOne({where: {id: codigoCultura}, relations: ["paises"]});
    
        if (!cultura)
          throw new BusinessLogicException("La cultura gastronómica con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < paises.length; i++) {
          const pais: PaisEntity = await this.paisRepository.findOne({where: {codigo: paises[i].codigo}});
          if (!pais)
            throw new BusinessLogicException("El país con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
        }
    
        cultura.paises = paises;
        return await this.culturaRepository.save(cultura);
      }
    
    async deletePaisCultura(codigoCultura: string, codigoPais: string){
        const pais: PaisEntity = await this.paisRepository.findOne({where: {codigo: codigoPais}});
        if (!pais)
          throw new BusinessLogicException("El país con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
    
        const cultura: CulturaEntity = await this.culturaRepository.findOne({where: {id: codigoCultura}, relations: ["paises"]});
        if (!cultura)
          throw new BusinessLogicException("La cultura gastronómica con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
    
        const culturaPais: PaisEntity = cultura.paises.find(e => e.codigo === pais.codigo);
    
        if (!culturaPais)
            throw new BusinessLogicException("El pais con el ID dado no se encuentra asociado a la cultura gastronómica", BusinessError.PRECONDITION_FAILED)
 
        cultura.paises = cultura.paises.filter(e => e.codigo !== codigoPais);
        await this.culturaRepository.save(cultura);
    }  

}
