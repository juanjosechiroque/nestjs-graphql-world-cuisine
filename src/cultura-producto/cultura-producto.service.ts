import { CACHE_MANAGER, Inject, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CulturaEntity } from '../cultura/cultura.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { Repository } from 'typeorm';
import { BusinessLogicException, BusinessError } from '../shared/errors/business-errors';
import { Cache } from 'cache-manager';

@Injectable()
export class CulturaProductoService {

    cacheKey: string = "cultura-producto-";

    constructor(
        @InjectRepository(CulturaEntity)
        private readonly culturaRepository: Repository<CulturaEntity>,

        @InjectRepository(ProductoEntity)
        private readonly productoRepository: Repository<ProductoEntity>,
        
        @Inject(CACHE_MANAGER)
        private readonly cacheManager: Cache
    ) { }

    async addProductoCultura(codigoCultura: string, codigoProducto: string): Promise<CulturaEntity> {
        const producto: ProductoEntity = await this.productoRepository.findOne({ where: { codigo: codigoProducto } });
        if (!producto)
            throw new BusinessLogicException("El producto con el ID dado no fue encontrado", BusinessError.NOT_FOUND);

        const cultura: CulturaEntity = await this.culturaRepository.findOne({ where: { id: codigoCultura }, relations: ["paises", "recetas", "restaurantes", "productos"] })
        if (!cultura)
            throw new BusinessLogicException("La cultura gastronómica con el ID dado no fue encontrada", BusinessError.NOT_FOUND);

        cultura.productos = [...cultura.productos, producto];
        return await this.culturaRepository.save(cultura);
    }

    async findProductoByCulturaIdProductoId(codigoCultura: string, codigoProducto: string): Promise<ProductoEntity> {
        const producto: ProductoEntity = await this.productoRepository.findOne({ where: { codigo: codigoProducto } });
        if (!producto)
            throw new BusinessLogicException("El producto con el ID dado no fue encontrado", BusinessError.NOT_FOUND)

        const cultura: CulturaEntity = await this.culturaRepository.findOne({ where: { id: codigoCultura }, relations: ["productos"] });
        if (!cultura)
            throw new BusinessLogicException("La cultura gastronómica con el ID dado no fue encontrado", BusinessError.NOT_FOUND)

        const culturaReceta: ProductoEntity = cultura.productos.find(e => e.codigo === producto.codigo);

        if (!culturaReceta)
            throw new BusinessLogicException("La receta con el ID dado no se encuentra asociado a la cultura gastronómica", BusinessError.PRECONDITION_FAILED)

        return culturaReceta;
    }

    async findProductoByCulturaId(codigoCultura: string): Promise<ProductoEntity[]> {
        
        const cached: ProductoEntity[] = await this.cacheManager.get<ProductoEntity[]>(this.cacheKey + codigoCultura);

        if(!cached) {
            const cultura: CulturaEntity = await this.culturaRepository.findOne({ where: { id: codigoCultura }, relations: ["productos"] });
            
            if (!cultura)
                throw new BusinessLogicException("La cultura gastronómica con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
            
            await this.cacheManager.set(this.cacheKey + codigoCultura, cultura.productos);
            return cultura.productos;
        }
        return cached;
    }

    async associateProductoCultura(codigoCultura: string, productos: ProductoEntity[]): Promise<CulturaEntity> {
        const cultura: CulturaEntity = await this.culturaRepository.findOne({where: {id: codigoCultura}, relations: ["productos"]});
    
        if (!cultura)
          throw new BusinessLogicException("La cultura gastronómica con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
    
        for (let i = 0; i < productos.length; i++) {
          const producto: ProductoEntity = await this.productoRepository.findOne({where: {codigo: productos[i].codigo}});
          if (!producto)
            throw new BusinessLogicException("El producto con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
        }
    
        cultura.productos = productos;
        return await this.culturaRepository.save(cultura);
      }
    
    async deleteProductoCultura(codigoCultura: string, codigoProducto: string){
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {codigo: codigoProducto}});
        if (!producto)
          throw new BusinessLogicException("El producto con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
    
        const cultura: CulturaEntity = await this.culturaRepository.findOne({where: {id: codigoCultura}, relations: ["productos"]});
        if (!cultura)
          throw new BusinessLogicException("La cultura gastronómica con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
    
        const culturaReceta: ProductoEntity = cultura.productos.find(e => e.codigo === producto.codigo);
    
        if (!culturaReceta)
            throw new BusinessLogicException("La receta con el ID dado no se encuentra asociado a la cultura gastronómica", BusinessError.PRECONDITION_FAILED)
 
        cultura.productos = cultura.productos.filter(e => e.codigo !== codigoProducto);
        await this.culturaRepository.save(cultura);
    } 

}
