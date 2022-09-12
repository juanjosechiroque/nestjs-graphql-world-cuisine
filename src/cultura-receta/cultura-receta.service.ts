import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CulturaEntity } from '../cultura/cultura.entity';
import { RecetaEntity } from '../receta/receta.entity';
import { Repository } from 'typeorm';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';
@Injectable()
export class CulturaRecetaService {

    constructor(
        @InjectRepository(CulturaEntity)
        private readonly culturaRepository: Repository<CulturaEntity>,

        @InjectRepository(RecetaEntity)
        private readonly recetaRepository: Repository<RecetaEntity>
    ) { }

    async addRecetaCultura(codigoCultura: string, codigoReceta: string): Promise<CulturaEntity> {
        const Receta: RecetaEntity = await this.recetaRepository.findOne({ where: { codigo: codigoReceta } });
        if (!Receta)
            throw new BusinessLogicException("La receta con el ID dado no fue encontrado", BusinessError.NOT_FOUND);

        const cultura: CulturaEntity = await this.culturaRepository.findOne({ where: { id: codigoCultura }, relations: ["paises", "recetas", "restaurantes", "productos"] })
        if (!cultura)
            throw new BusinessLogicException("La cultura gastronómica con el ID dado no fue encontrada", BusinessError.NOT_FOUND);

        cultura.recetas = [...cultura.recetas, Receta];
        return await this.culturaRepository.save(cultura);
    }

    async findRecetaByCulturaIdRecetaId(codigoCultura: string, codigoReceta: string): Promise<RecetaEntity> {
        const Receta: RecetaEntity = await this.recetaRepository.findOne({ where: { codigo: codigoReceta } });
        if (!Receta)
            throw new BusinessLogicException("La receta con el ID dado no fue encontrado", BusinessError.NOT_FOUND)

        const cultura: CulturaEntity = await this.culturaRepository.findOne({ where: { id: codigoCultura }, relations: ["recetas"] });
        if (!cultura)
            throw new BusinessLogicException("La cultura gastronómica con el ID dado no fue encontrado", BusinessError.NOT_FOUND)

        const culturaReceta: RecetaEntity = cultura.recetas.find(e => e.codigo === Receta.codigo);

        if (!culturaReceta)
            throw new BusinessLogicException("La receta con el ID dado no se encuentra asociado a la cultura gastronómica", BusinessError.PRECONDITION_FAILED)

        return culturaReceta;
    }

    async findRecetasByCulturaId(codigoCultura: string): Promise<RecetaEntity[]> {
        const cultura: CulturaEntity = await this.culturaRepository.findOne({ where: { id: codigoCultura }, relations: ["recetas"] });
        if (!cultura)
            throw new BusinessLogicException("La cultura gastronómica con el ID dado no fue encontrado", BusinessError.NOT_FOUND)

        return cultura.recetas;
    }

    async associateRecetasCultura(codigoCultura: string, recetas: RecetaEntity[]): Promise<CulturaEntity> {
        const cultura: CulturaEntity = await this.culturaRepository.findOne({where: {id: codigoCultura}, relations: ["recetas"]});
    
        if (!cultura)
          throw new BusinessLogicException("La cultura gastronómica con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < recetas.length; i++) {
          const Receta: RecetaEntity = await this.recetaRepository.findOne({where: {codigo: recetas[i].codigo}});
          if (!Receta)
            throw new BusinessLogicException("La receta con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
        }
    
        cultura.recetas = recetas;
        return await this.culturaRepository.save(cultura);
      }
    
    async deleteRecetaCultura(codigoCultura: string, codigoReceta: string){
        const Receta: RecetaEntity = await this.recetaRepository.findOne({where: {codigo: codigoReceta}});
        if (!Receta)
          throw new BusinessLogicException("La receta con el ID dado no fue encontrado", BusinessError.PRECONDITION_FAILED)
    
        const cultura: CulturaEntity = await this.culturaRepository.findOne({where: {id: codigoCultura}, relations: ["recetas"]});
        if (!cultura)
          throw new BusinessLogicException("La cultura gastronómica con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
    
        const culturaReceta: RecetaEntity = cultura.recetas.find(e => e.codigo === Receta.codigo);
    
        if (!culturaReceta)
            throw new BusinessLogicException("La receta con el ID dado no se encuentra asociado a la cultura gastronómica", BusinessError.PRECONDITION_FAILED)
 
        cultura.recetas = cultura.recetas.filter(e => e.codigo !== codigoReceta);
        await this.culturaRepository.save(cultura);
    } 

}
