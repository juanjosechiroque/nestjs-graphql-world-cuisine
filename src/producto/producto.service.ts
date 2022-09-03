import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from './producto.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ProductoService {

    constructor(
        @InjectRepository(ProductoEntity)
        private readonly productoRepository: Repository<ProductoEntity>
    ){}

    async findAll(): Promise<ProductoEntity[]> {
        return await this.productoRepository.find();
    }

    async findOne(codigo: string): Promise<ProductoEntity> {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {codigo} } );
        if (!producto)
          throw new BusinessLogicException("El producto con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
    
        return producto;
    }    

    async create(producto: ProductoEntity): Promise<ProductoEntity> {
        return await this.productoRepository.save(producto);
    }

    async update(codigo: string, producto: ProductoEntity): Promise<ProductoEntity> {
        const productoPersistido: ProductoEntity = await this.productoRepository.findOne({where:{codigo}});
        if (!productoPersistido)
          throw new BusinessLogicException("El producto con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
        
        return await this.productoRepository.save({...productoPersistido, ...producto});
    }

    async delete(codigo: string) {
        const producto: ProductoEntity = await this.productoRepository.findOne({where:{codigo}});
        if (!producto)
          throw new BusinessLogicException("El producto con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
      
        await this.productoRepository.remove(producto);
    }    


}
