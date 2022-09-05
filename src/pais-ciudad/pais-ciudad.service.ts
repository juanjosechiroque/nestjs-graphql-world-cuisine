import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { PaisEntity } from '../pais/pais.entity';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { Repository } from 'typeorm';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';
@Injectable()
export class PaisCiudadService {

    constructor(
        @InjectRepository(PaisEntity)
        private readonly paisRepository: Repository<PaisEntity>,

        @InjectRepository(CiudadEntity)
        private readonly ciudadRepository: Repository<CiudadEntity>
    ) { }

    async addCiudadPais(codigoPais: string, codigoCiudad: string): Promise<PaisEntity> {
        const Ciudad: CiudadEntity = await this.ciudadRepository.findOne({ where: { codigo: codigoCiudad } });
        if (!Ciudad)
            throw new BusinessLogicException("La ciudad con el ID dado no fue encontrada", BusinessError.NOT_FOUND);

        const pais: PaisEntity = await this.paisRepository.findOne({ where: { codigo: codigoPais }, relations: ["ciudades"] })
        if (!pais)
            throw new BusinessLogicException("El pais con el ID dado no fue encontrado", BusinessError.NOT_FOUND);

        pais.ciudades = [...pais.ciudades, Ciudad];
        return await this.paisRepository.save(pais);
    }

    async findCiudadByPaisIdCiudadId(codigoPais: string, codigoCiudad: string): Promise<CiudadEntity> {
        const Ciudad: CiudadEntity = await this.ciudadRepository.findOne({ where: { codigo: codigoCiudad } });
        if (!Ciudad)
            throw new BusinessLogicException("La ciudad con el ID dado no fue encontrada", BusinessError.NOT_FOUND)

        const pais: PaisEntity = await this.paisRepository.findOne({ where: { codigo: codigoPais }, relations: ["ciudades"] });
        if (!pais)
            throw new BusinessLogicException("El pais con el ID dado no fue encontrado", BusinessError.NOT_FOUND)

        const paisCiudad: CiudadEntity = pais.ciudades.find(e => e.codigo === Ciudad.codigo);

        if (!paisCiudad)
            throw new BusinessLogicException("La ciudad con el ID dado no se encuentra asociada al pais", BusinessError.PRECONDITION_FAILED)

        return paisCiudad;
    }

    async findCiudadesByPaisId(codigoPais: string): Promise<CiudadEntity[]> {
        const pais: PaisEntity = await this.paisRepository.findOne({ where: { codigo: codigoPais }, relations: ["ciudades"] });
        if (!pais)
            throw new BusinessLogicException("El pais con el ID dado no fue encontrado", BusinessError.NOT_FOUND)

        return pais.ciudades;
    }

    async associateCiudadesPais(codigoPais: string, ciudades: CiudadEntity[]): Promise<PaisEntity> {
        const pais: PaisEntity = await this.paisRepository.findOne({where: {codigo: codigoPais}, relations: ["ciudades"]});
    
        if (!pais)
          throw new BusinessLogicException("El pais con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < ciudades.length; i++) {
          const Ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {codigo: ciudades[i].codigo}});
          if (!Ciudad)
            throw new BusinessLogicException("La ciudad con el ID dado no fue encontrada", BusinessError.NOT_FOUND)
        }
    
        pais.ciudades = ciudades;
        return await this.paisRepository.save(pais);
      }
    
    async deleteCiudadPais(codigoPais: string, codigoCiudad: string){
        const Ciudad: CiudadEntity = await this.ciudadRepository.findOne({where: {codigo: codigoCiudad}});
        if (!Ciudad)
          throw new BusinessLogicException("La ciudad con el ID dado no fue encontrada", BusinessError.NOT_FOUND)
    
        const pais: PaisEntity = await this.paisRepository.findOne({where: {codigo: codigoPais}, relations: ["ciudades"]});
        if (!pais)
          throw new BusinessLogicException("El pais con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
    
        const paisCiudad: CiudadEntity = pais.ciudades.find(e => e.codigo === Ciudad.codigo);
    
        if (!paisCiudad)
            throw new BusinessLogicException("La ciudad con el ID dado no se encuentra asociada al pais", BusinessError.PRECONDITION_FAILED)
 
        pais.ciudades = pais.ciudades.filter(e => e.codigo !== codigoCiudad);
        await this.paisRepository.save(pais);
    } 

}
