/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaisEntity } from '../pais/pais.entity';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class CiudadPaisService {
    constructor(
        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>,
     
        @InjectRepository(PaisEntity)
        private readonly paisRepository: Repository<PaisEntity>
    ) {}

    async addPaisCiudad(codigoCiudad: string, codigoPais: string): Promise<CiudadEntity> {
        const pais: PaisEntity = await this.paisRepository.findOne({where: {codigo: codigoPais}});
        if (!pais)
          throw new BusinessLogicException("El pais con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
       
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {codigo: codigoCiudad}, relations: ["pais"]}) 
        if (!ciudad)
          throw new BusinessLogicException("La ciudad con el ID dado no fue encontrada", BusinessError.NOT_FOUND);
     
        ciudad.pais = pais;
        return await this.ciudadRepository.save(ciudad);
      }
     
    async findPaisByCiudadIdPaisId(codigoCiudad: string, codigoPais: string): Promise<PaisEntity> {
        const pais: PaisEntity = await this.paisRepository.findOne({where: {codigo: codigoPais}});
        if (!pais)
          throw new BusinessLogicException("El pais con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
        
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {codigo: codigoCiudad}, relations: ["pais"]}); 
        if (!ciudad)
          throw new BusinessLogicException("La ciudad con el ID dado no fue encontrada", BusinessError.NOT_FOUND)
    
        if (ciudad.pais.codigo != pais.codigo)
          throw new BusinessLogicException("El pais con el ID dado no esta asociada a la ciudad", BusinessError.PRECONDITION_FAILED)
    
        return ciudad.pais;
    }
     
    async findPaissByCiudadId(codigoCiudad: string): Promise<PaisEntity> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {codigo: codigoCiudad}, relations: ["pais"]});
        if (!ciudad)
          throw new BusinessLogicException("La ciudad con el ID dado no fue encontrada", BusinessError.NOT_FOUND)
        
        return ciudad.pais;
    }
     
    async associatePaissCiudad(codigoCiudad: string, pais: PaisEntity): Promise<CiudadEntity> {
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {codigo: codigoCiudad}, relations: ["pais"]});
     
        if (!ciudad)
          throw new BusinessLogicException("La ciudad con el ID dado no fue encontrada", BusinessError.NOT_FOUND)

        if (ciudad.pais.codigo != pais.codigo)
          throw new BusinessLogicException("El pais con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
          
        ciudad.pais = pais;
        return await this.ciudadRepository.save(ciudad);
      }
     
    async deletePaisCiudad(codigoCiudad: string, codigoPais: string){
        const pais: PaisEntity = await this.paisRepository.findOne({where: {codigo: codigoPais}});
        if (!pais)
          throw new BusinessLogicException("El pais con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
     
        const ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {codigo: codigoCiudad}, relations: ["pais"]});
        if (!ciudad)
          throw new BusinessLogicException("La ciudad con el ID dado no fue encontrada", BusinessError.NOT_FOUND)
     
        if (ciudad.pais.codigo != pais.codigo)
          throw new BusinessLogicException("El pais con el ID dado no esta asociada a la ciudad", BusinessError.PRECONDITION_FAILED)
  
        ciudad.pais = null;
        await this.ciudadRepository.save(ciudad);
    }   
}
