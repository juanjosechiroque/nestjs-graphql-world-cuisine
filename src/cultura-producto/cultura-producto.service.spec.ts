import { Test, TestingModule } from '@nestjs/testing';
import { CulturaProductoService } from './cultura-producto.service';
import { CulturaEntity } from '../cultura/cultura.entity';
import { ProductoEntity } from '../producto/producto.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('CulturaProductoService', () => {
  let service: CulturaProductoService;
  let productoRepository: Repository<ProductoEntity>;
  let culturaRepository: Repository<CulturaEntity>;
  let productosList: ProductoEntity[];
  let cultura: CulturaEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CulturaProductoService],
    }).compile();

    service = module.get<CulturaProductoService>(CulturaProductoService);
    productoRepository = module.get<Repository<ProductoEntity>>(getRepositoryToken(ProductoEntity));
    culturaRepository = module.get<Repository<CulturaEntity>>(getRepositoryToken(CulturaEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    culturaRepository.clear();
    productoRepository.clear();

    productosList = [];
    for (let i = 0; i < 5; i++) {
      const producto: ProductoEntity = await productoRepository.save({
        nombre: faker.lorem.sentence(),
        descripcion: faker.lorem.paragraph(),
        historia: faker.lorem.paragraph()
      })
      productosList.push(producto);
    }

    cultura = await culturaRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      productos: productosList
    })
  }

  it('Deberia estar definido', () => {
    expect(service).toBeDefined();
  });

  it('addProductoCultura deberia agregar un producto a una cultura', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      historia: faker.lorem.paragraph()
    });

    const newCultura: CulturaEntity = await culturaRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      productos: null
    })

    const result: CulturaEntity = await service.addProductoCultura(newCultura.id, newProducto.codigo);

    expect(result.productos).not.toBeNull();
    expect(result.productos[0].nombre).toBe(newProducto.nombre)
  });

  it('addProductoCultura deberia arrojar una excepcion por un producto invalida', async () => {
    const newCultura: CulturaEntity = await culturaRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      productos: null
    })

    await expect(() => service.addProductoCultura(newCultura.id, "0")).rejects.toHaveProperty("mensaje", "El producto con el ID dado no fue encontrado");
  });

  it('addProductoCultura deberia arrojar una excepcion por cultura invalido', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      historia: faker.lorem.paragraph()
    });

    await expect(() => service.addProductoCultura("0", newProducto.codigo)).rejects.toHaveProperty("mensaje", "La cultura gastronómica con el ID dado no fue encontrada");
  });

  it('findProductoByCulturaIdProductoId deberia retornar un producto por cultura', async () => {
    const pais: ProductoEntity = productosList[0];
    const storedPais: ProductoEntity = await service.findProductoByCulturaIdProductoId(cultura.id, pais.codigo,)
    expect(storedPais).not.toBeNull();
    expect(storedPais.nombre).toBe(pais.nombre);
  });

  it('findProductoByCulturaIdProductoId deberia arrojar una excepcion por un producto invalida', async () => {
    await expect(() => service.findProductoByCulturaIdProductoId(cultura.id, "0")).rejects.toHaveProperty("mensaje", "El producto con el ID dado no fue encontrado");
  });

  it('findProductoByCulturaIdProductoId deberia arrojar una excepcion por una cultura invalido', async () => {
    const pais: ProductoEntity = productosList[0];
    await expect(() => service.findProductoByCulturaIdProductoId("0", pais.codigo)).rejects.toHaveProperty("mensaje", "La cultura gastronómica con el ID dado no fue encontrado");
  });

  it('findProductoByCulturaIdProductoId deberia arrojar una excepcion por un producto no asociada a cultura', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      historia: faker.lorem.paragraph()
    });

    await expect(() => service.findProductoByCulturaIdProductoId(cultura.id, newProducto.codigo)).rejects.toHaveProperty("mensaje", "La receta con el ID dado no se encuentra asociado a la cultura gastronómica");
  });

  it('findProductoByCulturaId deberia retornar productos por cultura', async () => {
    const productos: ProductoEntity[] = await service.findProductoByCulturaId(cultura.id);
    expect(productos).not.toBeNull()
  });

  it('findProductoByCulturaId deberia arrojar una excepcion por una cultura invalida', async () => {
    await expect(() => service.findProductoByCulturaId("0")).rejects.toHaveProperty("mensaje", "La cultura gastronómica con el ID dado no fue encontrado");
  });

  it('associateProductoCultura deberia actualizar el producto para una cultura', async () => {
    const newProducto: ProductoEntity = productosList[0];

    const updatedCultura: CulturaEntity = await service.associateProductoCultura(cultura.id, [newProducto]);
    expect(updatedCultura.productos).not.toBeNull()

    expect(updatedCultura.productos[0].nombre).toBe(newProducto.nombre);
  });

  it('associateProductoCultura deberia arrojar una excepcion por una cultura invalido', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      historia: faker.lorem.paragraph()
    });

    await expect(() => service.associateProductoCultura("0", [newProducto])).rejects.toHaveProperty("mensaje", "La cultura gastronómica con el ID dado no fue encontrado");
  });

  it('associateProductoCultura deberia arrojar una escepcion por una receta invalida', async () => {
    const newProducto: ProductoEntity = productosList[0];
    newProducto.codigo = "0";

    await expect(() => service.associateProductoCultura(cultura.id, [newProducto])).rejects.toHaveProperty("mensaje", "El producto con el ID dado no fue encontrado");
  });

  it('deleteProductoCultura deberia eliminar una receta de una cultura', async () => {
    const producto: ProductoEntity = productosList[0];

    await service.deleteProductoCultura(cultura.id, producto.codigo);

    const storedCultura: CulturaEntity = await culturaRepository.findOne({ where: { id: cultura.id }, relations: ["productos"] });
    const deletedProducto: ProductoEntity = storedCultura.productos.find(a => a.codigo === producto.codigo);

    expect(deletedProducto).toBeUndefined();

  });

  it('deleteProductoCultura deberia retornar una excepcion por una receta invalida', async () => {
    await expect(() => service.deleteProductoCultura(cultura.id, "0")).rejects.toHaveProperty("mensaje", "El producto con el ID dado no fue encontrado");
  });

  it('deleteProductoCultura deberia arrojar una excepcion por una cultura invalido', async () => {
    const producto: ProductoEntity = productosList[0];
    await expect(() => service.deleteProductoCultura("0", producto.codigo)).rejects.toHaveProperty("mensaje", "La cultura gastronómica con el ID dado no fue encontrado");
  });

  it('deleteProductoCultura deberia arrojar una excepcion por una receta no asociada', async () => {
    const newProducto: ProductoEntity = await productoRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      historia: faker.lorem.paragraph()
    });

    await expect(() => service.deleteProductoCultura(cultura.id, newProducto.codigo)).rejects.toHaveProperty("mensaje", "La receta con el ID dado no se encuentra asociado a la cultura gastronómica");
  });


  



});

