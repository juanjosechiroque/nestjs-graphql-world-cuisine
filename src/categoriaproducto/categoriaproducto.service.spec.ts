import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaproductoService } from './categoriaproducto.service';
import { CategoriaproductoEntity } from './categoriaproducto.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('CategoriaproductoService', () => {
  let service: CategoriaproductoService;
  let repository: Repository<CategoriaproductoEntity>;
  let listaCategoriasproducto: CategoriaproductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CategoriaproductoService],
    }).compile();

    service = module.get<CategoriaproductoService>(CategoriaproductoService);
    repository = module.get<Repository<CategoriaproductoEntity>>(getRepositoryToken(CategoriaproductoEntity));
    await seedDatabase();    
  });

  const seedDatabase = async () => {
    repository.clear();
    listaCategoriasproducto = [];
    for(let i = 0; i < 5; i++){
        const categoriaproducto: CategoriaproductoEntity = await repository.save({
        nombre: faker.lorem.sentence(),
        productos: []
      })
        listaCategoriasproducto.push(categoriaproducto);
    }
  }  

  it('Deberia estar definido', () => {
    expect(service).toBeDefined();
  });

  it('findAll deberia retornar todas las categorias de producto', async () => {
    const categoriasproducto: CategoriaproductoEntity[] = await service.findAll();
    expect(categoriasproducto).not.toBeNull();
    expect(categoriasproducto).toHaveLength(listaCategoriasproducto.length);
  });  

  it('findOne deberia retornar una categoria de producto por ID', async () => {
    const categoriaProductoAlmaceneda: CategoriaproductoEntity = listaCategoriasproducto[0];
    const museum: CategoriaproductoEntity = await service.findOne(categoriaProductoAlmaceneda.codigo);
    expect(museum).not.toBeNull();
    expect(museum.nombre).toEqual(categoriaProductoAlmaceneda.nombre)
  }); 

  it('findOne deberia arrojar una excepcion por una categoria de producto invalida', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "La categoria de producto con el ID dado no fue encontrado")
  });  

  it('create deberia retornar una nueva categoria de producto', async () => {
    const categoriaproducto: CategoriaproductoEntity = {
      codigo: "",
      nombre: faker.lorem.sentence(),
      productos: []
    }

    const nuevaCategoriaProducto: CategoriaproductoEntity = await service.create(categoriaproducto);
    expect(nuevaCategoriaProducto).not.toBeNull();

    const categoriaProductoAlmaceneda: CategoriaproductoEntity = await repository.findOne({where: {codigo: nuevaCategoriaProducto.codigo}})
    expect(categoriaProductoAlmaceneda).not.toBeNull();
    expect(categoriaProductoAlmaceneda.nombre).toEqual(nuevaCategoriaProducto.nombre)
  });  

  it('update deberia modificar una categoria de producto', async () => {
    const categoriaProducto: CategoriaproductoEntity = listaCategoriasproducto[0];
    categoriaProducto.nombre = "New name";
  
    const categoriaproductoActualizado: CategoriaproductoEntity = await service.update(categoriaProducto.codigo, categoriaProducto);
    expect(categoriaproductoActualizado).not.toBeNull();
  
    const categoriaProductoAlmacenada: CategoriaproductoEntity = await repository.findOne({ where: { codigo: categoriaProducto.codigo } })
    expect(categoriaProductoAlmacenada).not.toBeNull();
    expect(categoriaProductoAlmacenada.nombre).toEqual(categoriaProducto.nombre)
  });

  it('update deberia arrojar una excepcion por una categoria de producto invalida', async () => {
    let categoriaProducto: CategoriaproductoEntity = listaCategoriasproducto[0];
    categoriaProducto = {
      ...categoriaProducto, nombre: "New name"
    }
    await expect(() => service.update("0", categoriaProducto)).rejects.toHaveProperty("message", "La categoria de producto con el ID dado no fue encontrado")
  });  

  it('delete deberia eliminar una categoria de producto', async () => {
    const categoriaProducto: CategoriaproductoEntity = listaCategoriasproducto[0];
    await service.delete(categoriaProducto.codigo);
  
    const categoriaProductoBorrado: CategoriaproductoEntity = await repository.findOne({ where: { codigo: categoriaProducto.codigo } })
    expect(categoriaProductoBorrado).toBeNull();
  });

  it('delete deberia arrojar una excepcion por una categoria de producto invalida', async () => {
    const categoriaProducto: CategoriaproductoEntity = listaCategoriasproducto[0];
    await service.delete(categoriaProducto.codigo);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "La categoria de producto con el ID dado no fue encontrado")
  });

});
