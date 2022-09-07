/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaproductoEntity } from '../categoriaproducto/categoriaproducto.entity';
import { Repository } from 'typeorm';
import { ProductoEntity } from '../producto/producto.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { ProductoCategoriaproductoService } from './producto-categoriaproducto.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('ProductoCategoriaproductoService', () => {
  let service: ProductoCategoriaproductoService;
  let productoRepository: Repository<ProductoEntity>;
  let categoriaproductoRepository: Repository<CategoriaproductoEntity>;
  let producto: ProductoEntity;
  let ListaCategoriasproducto : CategoriaproductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoCategoriaproductoService],
    }).compile();

    service = module.get<ProductoCategoriaproductoService>(ProductoCategoriaproductoService);
    productoRepository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));
    categoriaproductoRepository = module.get<Repository<CategoriaproductoEntity>>(getRepositoryToken(CategoriaproductoEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    categoriaproductoRepository.clear();
    productoRepository.clear();

    ListaCategoriasproducto = [];
    for(let i = 0; i < 1; i++){
        const categoriaproducto: CategoriaproductoEntity = await categoriaproductoRepository.save({
          nombre: faker.company.name() 
        })
        ListaCategoriasproducto.push(categoriaproducto);
    }

    producto = await productoRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      historia: faker.lorem.paragraph(),
      categoriaProducto: ListaCategoriasproducto[0]
    })
  }

  it('Deberia estar definido', () => {
    expect(service).toBeDefined();
  });

  it('addCategoriaproductoProducto deberia agregar una categoria de producto a un producto', async () => {
    const newCategoriaproducto: CategoriaproductoEntity = await categoriaproductoRepository.save({
      nombre: faker.company.name() 
    });

    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      historia: faker.lorem.paragraph(),
      categoriaproductos: null
    })

    const result: ProductoEntity = await service.addCategoriaproductoProducto(newProducto.codigo, newCategoriaproducto.codigo);
    
    expect(result.categoriaProducto).not.toBeNull();
    expect(result.categoriaProducto.nombre).toBe(newCategoriaproducto.nombre)
  });

  it('addCategoriaproductoProducto deberia arrojar una excepcion por una categoria de proucto invalida', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      historia: faker.lorem.paragraph(),
      categoriaproductos: null
    })

    await expect(() => service.addCategoriaproductoProducto(newProducto.codigo, "0")).rejects.toHaveProperty("message", "La categoria de producto con el ID dado no fue encontrada");
  });

  it('addCategoriaproductoProducto deberia arrojar una excepcion por un producto invalido', async () => {
    const newCategoriaproducto: CategoriaproductoEntity = await categoriaproductoRepository.save({
      nombre: faker.company.name() 
    });

    await expect(() => service.addCategoriaproductoProducto("0", newCategoriaproducto.codigo)).rejects.toHaveProperty("message", "El producto con el ID dado no fue encontrado");
  });

  it('findCategoriaproductoByProductoIdCategoriaproductoId deberia retornar una categoria de producto por producto', async () => {
    const categoriaproducto: CategoriaproductoEntity = ListaCategoriasproducto[0];
    const storedCategoriaproducto: CategoriaproductoEntity = await service.findCategoriaproductoByProductoIdCategoriaproductoId(producto.codigo, categoriaproducto.codigo, )
    expect(storedCategoriaproducto).not.toBeNull();
    expect(storedCategoriaproducto.nombre).toBe(categoriaproducto.nombre);
  });

  it('findCategoriaproductoByProductoIdCategoriaproductoId deberia arrojar una excepcion por una categoria de producto invalida', async () => {
    await expect(()=> service.findCategoriaproductoByProductoIdCategoriaproductoId(producto.codigo, "0")).rejects.toHaveProperty("message", "La categoria de producto con el ID dado no fue encontrada"); 
  });

  it('findCategoriaproductoByProductoIdCategoriaproductoId deberia arrojar una excepcion por un producto invalido', async () => {
    const categoriaproducto: CategoriaproductoEntity = ListaCategoriasproducto[0]; 
    await expect(()=> service.findCategoriaproductoByProductoIdCategoriaproductoId("0", categoriaproducto.codigo)).rejects.toHaveProperty("message", "El producto con el ID dado no fue encontrado"); 
  });

  it('findCategoriaproductoByProductoIdCategoriaproductoId deberia arrojar una excepcion por una categoria de producto no asociada al producto', async () => {
    const newCategoriaproducto: CategoriaproductoEntity = await categoriaproductoRepository.save({
      nombre: faker.company.name() 
    });

    await expect(()=> service.findCategoriaproductoByProductoIdCategoriaproductoId(producto.codigo, newCategoriaproducto.codigo)).rejects.toHaveProperty("message", "La categoria de producto con el ID dado no esta asociada al producto"); 
  });

  it('findCategoriaproductosByProductoId deberia retornar una categoria de producto por producto', async ()=>{
    const categoriaproducto: CategoriaproductoEntity = await service.findCategoriaproductosByProductoId(producto.codigo);
    expect(categoriaproducto).not.toBeNull()
  });

  it('findCategoriaproductosByProductoId deberia arrojar una excepcion por un producto invalido', async () => {
    await expect(()=> service.findCategoriaproductosByProductoId("0")).rejects.toHaveProperty("message", "El producto con el ID dado no fue encontrado"); 
  });

  it('associateCategoriaproductosProducto deberia actualizar la categoria de producto para un producto', async () => {
    const newCategoriaproducto: CategoriaproductoEntity = ListaCategoriasproducto[0];

    const updatedProducto: ProductoEntity = await service.associateCategoriaproductosProducto(producto.codigo, newCategoriaproducto);
    expect(updatedProducto.categoriaProducto).not.toBeNull()

    expect(updatedProducto.categoriaProducto.nombre).toBe(newCategoriaproducto.nombre);
  });

  it('associateCategoriaproductosProducto deberia arrojar una excepcion por un producto invalido', async () => {
    const newCategoriaproducto: CategoriaproductoEntity = await categoriaproductoRepository.save({
      nombre: faker.company.name() 
    });

    await expect(()=> service.associateCategoriaproductosProducto("0", newCategoriaproducto)).rejects.toHaveProperty("message", "El producto con el ID dado no fue encontrado"); 
  });

  it('associateCategoriaproductosProducto deberia arrojar una escepcion por una categoria de producto invalida', async () => {
    const newCategoriaproducto: CategoriaproductoEntity = ListaCategoriasproducto[0];
    newCategoriaproducto.codigo = "0";

    await expect(()=> service.associateCategoriaproductosProducto(producto.codigo, newCategoriaproducto)).rejects.toHaveProperty("message", "La categoria de producto con el ID dado no fue encontrada"); 
  });

  it('deleteCategoriaproductoToProducto deberia eliminar una categoria de producto de un producto', async () => {
    const categoriaproducto: CategoriaproductoEntity = ListaCategoriasproducto[0];
    
    await service.deleteCategoriaproductoProducto(producto.codigo, categoriaproducto.codigo);

    const storedProducto: ProductoEntity = await productoRepository.findOne({where: {codigo: producto.codigo}, relations: ["categoriaProducto"]});
    const deletedCategoriaproducto: CategoriaproductoEntity = storedProducto.categoriaProducto;

    expect(deletedCategoriaproducto).toBeNull();

  });

  it('deleteCategoriaproductoToProducto deberia retornar una excepcion por una categoria de producto invalida', async () => {
    await expect(()=> service.deleteCategoriaproductoProducto(producto.codigo, "0")).rejects.toHaveProperty("message", "La categoria de producto con el ID dado no fue encontrada"); 
  });

  it('deleteCategoriaproductoToProducto deberia arrojar una excepcion por un producto invalido', async () => {
    const categoriaproducto: CategoriaproductoEntity = ListaCategoriasproducto[0];
    await expect(()=> service.deleteCategoriaproductoProducto("0", categoriaproducto.codigo)).rejects.toHaveProperty("message", "El producto con el ID dado no fue encontrado"); 
  });

  it('deleteCategoriaproductoToProducto deberia arrojar una excepcion por una categoria de producto no asociada', async () => {
    const newCategoriaproducto: CategoriaproductoEntity = await categoriaproductoRepository.save({
      nombre: faker.company.name() 
    });

    await expect(()=> service.deleteCategoriaproductoProducto(producto.codigo, newCategoriaproducto.codigo)).rejects.toHaveProperty("message", "La categoria de producto con el ID dado no esta asociada al producto"); 
  }); 

});
