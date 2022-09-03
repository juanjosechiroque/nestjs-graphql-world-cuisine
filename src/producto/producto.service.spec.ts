import { Test, TestingModule } from '@nestjs/testing';
import { ProductoService } from './producto.service';
import { ProductoEntity } from './producto.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('ProductoService', () => {
  let service: ProductoService;
  let repository: Repository<ProductoEntity>;
  let listaProductos: ProductoEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [ProductoService],
    }).compile();

    service = module.get<ProductoService>(ProductoService);
    repository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));
    await seedDatabase();    
  });

  const seedDatabase = async () => {
    repository.clear();
    listaProductos = [];
    for(let i = 0; i < 5; i++){
        const producto: ProductoEntity = await repository.save({
        nombre: faker.lorem.sentence(),
        descripcion: faker.lorem.paragraph(),
        historia: faker.lorem.paragraph(),
        categoriaProducto: null
        })
        listaProductos.push(producto);
    }
  }  

  it('Deberia estar definido', () => {
    expect(service).toBeDefined();
  });

  it('findAll deberia retornar todos los productos', async () => {
    const productos: ProductoEntity[] = await service.findAll();
    expect(productos).not.toBeNull();
    expect(productos).toHaveLength(listaProductos.length);
  });  

  it('findOne deberia retornar un producto por ID', async () => {
    const productoAlmacenado: ProductoEntity = listaProductos[0];
    const producto: ProductoEntity = await service.findOne(productoAlmacenado.codigo);
    expect(producto).not.toBeNull();
    expect(producto.nombre).toEqual(productoAlmacenado.nombre)
    expect(producto.descripcion).toEqual(productoAlmacenado.descripcion)
    expect(producto.historia).toEqual(productoAlmacenado.historia)
  }); 

  it('findOne deberia arrojar una excepcion por un producto invalido', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("mensaje", "El producto con el ID dado no fue encontrado")
  });  

  it('create deberia retornar un nuevo producto', async () => {
    const producto: ProductoEntity = {
      codigo: "",
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      historia: faker.lorem.paragraph(),
      categoriaProducto: null
    }

    const nuevoProducto: ProductoEntity = await service.create(producto);
    expect(nuevoProducto).not.toBeNull();

    const productoAlmacenado: ProductoEntity = await repository.findOne({where: {codigo: nuevoProducto.codigo}})
    expect(productoAlmacenado).not.toBeNull();
    expect(productoAlmacenado.nombre).toEqual(nuevoProducto.nombre)
    expect(productoAlmacenado.descripcion).toEqual(nuevoProducto.descripcion)
    expect(productoAlmacenado.historia).toEqual(nuevoProducto.historia)
  });  

  it('update deberia modificar un producto', async () => {
    const producto: ProductoEntity = listaProductos[0];
    producto.nombre = "New name";
    producto.descripcion = "New description";
    producto.historia = "New history";
  
    const productoActualizado: ProductoEntity = await service.update(producto.codigo, producto);
    expect(productoActualizado).not.toBeNull();
  
    const productoAlmacenado: ProductoEntity = await repository.findOne({ where: { codigo: producto.codigo } })
    expect(productoAlmacenado).not.toBeNull();
    expect(productoAlmacenado.nombre).toEqual(producto.nombre)
    expect(productoAlmacenado.descripcion).toEqual(producto.descripcion)
    expect(productoAlmacenado.historia).toEqual(producto.historia)
  });

  it('update deberia arrojar una excepcion por un producto invalido', async () => {
    let producto: ProductoEntity = listaProductos[0];
    producto = {
      ...producto, nombre: "New name"
    }
    await expect(() => service.update("0", producto)).rejects.toHaveProperty("mensaje", "El producto con el ID dado no fue encontrado")
  });  

  it('delete deberia eliminar un producto', async () => {
    const producto: ProductoEntity = listaProductos[0];
    await service.delete(producto.codigo);
  
    const productoBorrado: ProductoEntity = await repository.findOne({ where: { codigo: producto.codigo } })
    expect(productoBorrado).toBeNull();
  });

  it('delete deberia arrojar una excepcion por un producto invalido', async () => {
    const producto: ProductoEntity = listaProductos[0];
    await service.delete(producto.codigo);
    await expect(() => service.delete("0")).rejects.toHaveProperty("mensaje", "El producto con el ID dado no fue encontrado")
  });

});
