import { Test, TestingModule } from '@nestjs/testing';
import { RestauranteService } from './restaurante.service';
import { RestauranteEntity } from './restaurante.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CacheModule } from '@nestjs/common';

describe('RestauranteService', () => {
  let service: RestauranteService;
  let repository: Repository<RestauranteEntity>;
  let listaRestaurantes: RestauranteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(),CacheModule.register()],
      providers: [RestauranteService],
    }).compile();

    service = module.get<RestauranteService>(RestauranteService);
    repository = module.get<Repository<RestauranteEntity>>(getRepositoryToken(RestauranteEntity));
    await seedDatabase();    
  });

  const seedDatabase = async () => {
    repository.clear();
    listaRestaurantes = [];
    for(let i = 0; i < 5; i++){
        const restaurante: RestauranteEntity = await repository.save({
        nombre: faker.lorem.sentence(),
        estrellasMichelin: faker.datatype.number(),
        fechaConsecusion: faker.date.birthdate(),
        descripcion: faker.lorem.paragraph(),
        direccion: faker.address.direction(),
        telefono: faker.phone.number(),
        foto: faker.image.imageUrl()
        })
        listaRestaurantes.push(restaurante);
    }
  }  

  it('Deberia estar definido', () => {
    expect(service).toBeDefined();
  });

  it('findAll deberia retornar todos los restaurantes', async () => {
    const restaurantes: RestauranteEntity[] = await service.findAll();
    expect(restaurantes).not.toBeNull();
    expect(restaurantes).toHaveLength(listaRestaurantes.length);
  });  

  it('findOne deberia retornar un restaurante por ID', async () => {
    const restauranteAlmacenado: RestauranteEntity = listaRestaurantes[0];
    const restaurante: RestauranteEntity = await service.findOne(restauranteAlmacenado.codigo);
    expect(restaurante).not.toBeNull();
    expect(restaurante.nombre).toEqual(restauranteAlmacenado.nombre)
    expect(restaurante.estrellasMichelin).toEqual(restauranteAlmacenado.estrellasMichelin)
    expect(restaurante.fechaConsecusion).toEqual(restauranteAlmacenado.fechaConsecusion)
    expect(restaurante.descripcion).toEqual(restauranteAlmacenado.descripcion)
    expect(restaurante.direccion).toEqual(restauranteAlmacenado.direccion)
    expect(restaurante.telefono).toEqual(restauranteAlmacenado.telefono)
    expect(restaurante.foto).toEqual(restauranteAlmacenado.foto)
  }); 

  it('findOne deberia arrojar una excepcion por un restaurante invalido', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El restaurante con el ID dado no fue encontrado")
  });  

  it('create deberia retornar un nuevo restaurante', async () => {
    const restaurante: RestauranteEntity = {
      codigo: "",
      nombre: faker.lorem.sentence(),
      estrellasMichelin: faker.datatype.number(),
      fechaConsecusion: faker.date.birthdate(),
      descripcion: faker.lorem.paragraph(),
      direccion: faker.address.direction(),
      telefono: faker.phone.number(),
      foto: faker.image.imageUrl(),
      ciudad: null
  }

    const nuevoRestaurante: RestauranteEntity = await service.create(restaurante);
    expect(nuevoRestaurante).not.toBeNull();

    const restauranteAlmacenado: RestauranteEntity = await repository.findOne({where: {codigo: nuevoRestaurante.codigo}})
    expect(restauranteAlmacenado).not.toBeNull();
    expect(restauranteAlmacenado.nombre).toEqual(nuevoRestaurante.nombre)
    expect(restauranteAlmacenado.estrellasMichelin).toEqual(nuevoRestaurante.estrellasMichelin)
    expect(restauranteAlmacenado.fechaConsecusion).toEqual(nuevoRestaurante.fechaConsecusion)
    expect(restauranteAlmacenado.descripcion).toEqual(nuevoRestaurante.descripcion)
    expect(restauranteAlmacenado.direccion).toEqual(nuevoRestaurante.direccion)
    expect(restauranteAlmacenado.telefono).toEqual(nuevoRestaurante.telefono)
    expect(restauranteAlmacenado.foto).toEqual(nuevoRestaurante.foto)
  });  

  it('update deberia modificar un restaurante', async () => {
    const restaurante: RestauranteEntity = listaRestaurantes[0];
    restaurante.nombre = "New name";
    restaurante.estrellasMichelin = 0;
    restaurante.descripcion = "New description";
    restaurante.direccion = "New direction";
    restaurante.telefono = "New phone";
    restaurante.foto = "New photo";
  
    const restauranteActualizado: RestauranteEntity = await service.update(restaurante.codigo, restaurante);
    expect(restauranteActualizado).not.toBeNull();
  
    const restauranteAlmacenado: RestauranteEntity = await repository.findOne({ where: { codigo: restaurante.codigo } })
    expect(restauranteAlmacenado).not.toBeNull();
    expect(restauranteAlmacenado.nombre).toEqual(restaurante.nombre)
    expect(restauranteAlmacenado.estrellasMichelin).toEqual(restaurante.estrellasMichelin)
    expect(restauranteAlmacenado.descripcion).toEqual(restaurante.descripcion)
    expect(restauranteAlmacenado.direccion).toEqual(restaurante.direccion)
    expect(restauranteAlmacenado.telefono).toEqual(restaurante.telefono)
    expect(restauranteAlmacenado.foto).toEqual(restaurante.foto)
  });

  it('update deberia arrojar una excepcion por un restaurante invalido', async () => {
    let restaurante: RestauranteEntity = listaRestaurantes[0];
    restaurante = {
      ...restaurante, nombre: "New name"
    }
    await expect(() => service.update("0", restaurante)).rejects.toHaveProperty("message", "El restaurante con el ID dado no fue encontrado")
  });  

  it('delete deberia eliminar un restaurante', async () => {
    const restaurante: RestauranteEntity = listaRestaurantes[0];
    await service.delete(restaurante.codigo);
  
    const restauranteBorrado: RestauranteEntity = await repository.findOne({ where: { codigo: restaurante.codigo } })
    expect(restauranteBorrado).toBeNull();
  });

  it('delete deberia arrojar una excepcion por un restaurante invalido', async () => {
    const restaurante: RestauranteEntity = listaRestaurantes[0];
    await service.delete(restaurante.codigo);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El restaurante con el ID dado no fue encontrado")
  });

});
