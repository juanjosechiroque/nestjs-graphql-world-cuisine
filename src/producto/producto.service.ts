import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ProductoEntity } from './producto.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';
import { Cache } from 'cache-manager';

@Injectable()
export class ProductoService {

    cacheKey: string = "productos";

    constructor(
        @InjectRepository(ProductoEntity)
        private readonly productoRepository: Repository<ProductoEntity>,
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache        
    ){}

    async findAll(): Promise<ProductoEntity[]> {
        const cached: ProductoEntity[] = await this.cacheManager.get<ProductoEntity[]>(this.cacheKey);

        if(!cached) {
            const productos: ProductoEntity[] = await this.productoRepository.find();
            await this.cacheManager.set(this.cacheKey, productos);
            return productos;
        }
        return cached;

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
