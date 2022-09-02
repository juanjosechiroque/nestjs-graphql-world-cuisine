import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriaproductoEntity } from './categoriaproducto.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class CategoriaproductoService {

    constructor(
        @InjectRepository(CategoriaproductoEntity)
        private readonly categoriaproductoRepository: Repository<CategoriaproductoEntity>
    ){}

    async findAll(): Promise<CategoriaproductoEntity[]> {
        return await this.categoriaproductoRepository.find();
    }

    async findOne(codigo: string): Promise<CategoriaproductoEntity> {
        const categoriaproducto: CategoriaproductoEntity = await this.categoriaproductoRepository.findOne({where: {codigo} } );
        if (!categoriaproducto)
          throw new BusinessLogicException("La categoria de producto con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
    
        return categoriaproducto;
    }    

    async create(categoriaproducto: CategoriaproductoEntity): Promise<CategoriaproductoEntity> {
        return await this.categoriaproductoRepository.save(categoriaproducto);
    }

    async update(codigo: string, categoriaproducto: CategoriaproductoEntity): Promise<CategoriaproductoEntity> {
        const categoriaproductoPersistida: CategoriaproductoEntity = await this.categoriaproductoRepository.findOne({where:{codigo}});
        if (!categoriaproductoPersistida)
          throw new BusinessLogicException("La categoria de producto con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
        
        return await this.categoriaproductoRepository.save({...categoriaproductoPersistida, ...categoriaproducto});
    }

    async delete(codigo: string) {
        const categoriaproducto: CategoriaproductoEntity = await this.categoriaproductoRepository.findOne({where:{codigo}});
        if (!categoriaproducto)
          throw new BusinessLogicException("La categoria de producto con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
      
        await this.categoriaproductoRepository.remove(categoriaproducto);
    }    


}
