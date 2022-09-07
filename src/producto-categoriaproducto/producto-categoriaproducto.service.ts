/* eslint-disable prettier/prettier */
import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { CategoriaproductoEntity } from '../categoriaproducto/categoriaproducto.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { Repository } from 'typeorm';
import { BusinessError, BusinessLogicException } from '../shared/errors/business-errors';

@Injectable()
export class ProductoCategoriaproductoService {
    constructor(
        @InjectRepository(ProductoEntity)
        private readonly productoRepository: Repository<ProductoEntity>,
     
        @InjectRepository(CategoriaproductoEntity)
        private readonly categoriaproductoRepository: Repository<CategoriaproductoEntity>
    ) {}

    async addCategoriaproductoProducto(codigoProducto: string, codigoCategoriaproducto: string): Promise<ProductoEntity> {
        const categoriaproducto: CategoriaproductoEntity = await this.categoriaproductoRepository.findOne({where: {codigo: codigoCategoriaproducto}});
        if (!categoriaproducto)
          throw new BusinessLogicException("La categoria de producto con el ID dado no fue encontrada", BusinessError.NOT_FOUND);
       
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {codigo: codigoProducto}, relations: ["categoriaProducto"]}) 
        if (!producto)
          throw new BusinessLogicException("El producto con el ID dado no fue encontrado", BusinessError.NOT_FOUND);
     
        producto.categoriaProducto = categoriaproducto;
        return await this.productoRepository.save(producto);
      }
     
    async findCategoriaproductoByProductoIdCategoriaproductoId(codigoProducto: string, codigoCategoriaproducto: string): Promise<CategoriaproductoEntity> {
        const categoriaproducto: CategoriaproductoEntity = await this.categoriaproductoRepository.findOne({where: {codigo: codigoCategoriaproducto}});
        if (!categoriaproducto)
          throw new BusinessLogicException("La categoria de producto con el ID dado no fue encontrada", BusinessError.NOT_FOUND)
        
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {codigo: codigoProducto}, relations: ["categoriaProducto"]}); 
        if (!producto)
          throw new BusinessLogicException("El producto con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
    
        if (producto.categoriaProducto.codigo != categoriaproducto.codigo)
          throw new BusinessLogicException("La categoria de producto con el ID dado no esta asociada al producto", BusinessError.PRECONDITION_FAILED)
    
        return producto.categoriaProducto;
    }
     
    async findCategoriaproductosByProductoId(codigoProducto: string): Promise<CategoriaproductoEntity> {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {codigo: codigoProducto}, relations: ["categoriaProducto"]});
        if (!producto)
          throw new BusinessLogicException("El producto con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
        
        return producto.categoriaProducto;
    }
     
    async associateCategoriaproductosProducto(codigoProducto: string, categoriaproducto: CategoriaproductoEntity): Promise<ProductoEntity> {
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {codigo: codigoProducto}, relations: ["categoriaProducto"]});
     
        if (!producto)
          throw new BusinessLogicException("El producto con el ID dado no fue encontrado", BusinessError.NOT_FOUND)

        if (producto.categoriaProducto.codigo != categoriaproducto.codigo)
          throw new BusinessLogicException("La categoria de producto con el ID dado no fue encontrada", BusinessError.NOT_FOUND)
          
        producto.categoriaProducto = categoriaproducto;
        return await this.productoRepository.save(producto);
      }
     
    async deleteCategoriaproductoProducto(codigoProducto: string, codigoCategoriaproducto: string){
        const categoriaproducto: CategoriaproductoEntity = await this.categoriaproductoRepository.findOne({where: {codigo: codigoCategoriaproducto}});
        if (!categoriaproducto)
          throw new BusinessLogicException("La categoria de producto con el ID dado no fue encontrada", BusinessError.NOT_FOUND)
     
        const producto: ProductoEntity = await this.productoRepository.findOne({where: {codigo: codigoProducto}, relations: ["categoriaProducto"]});
        if (!producto)
          throw new BusinessLogicException("El producto con el ID dado no fue encontrado", BusinessError.NOT_FOUND)
     
        if ( producto.categoriaProducto != null && producto.categoriaProducto.codigo != categoriaproducto.codigo)
          throw new BusinessLogicException("La categoria de producto con el ID dado no esta asociada al producto", BusinessError.PRECONDITION_FAILED)
  
        producto.categoriaProducto = null;
        await this.productoRepository.save(producto);
    }   
}
