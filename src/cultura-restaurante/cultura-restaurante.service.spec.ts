import { Test, TestingModule } from '@nestjs/testing';
import { CulturaEntity } from '../cultura/cultura.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { Repository } from 'typeorm';
import { getRepositoryToken } from '@nestjs/typeorm';
import { CulturaRestauranteService } from './cultura-restaurante.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { faker } from '@faker-js/faker';

describe('CulturaRestauranteService', () => {
  let service: CulturaRestauranteService;
  let culturaRepository: Repository<CulturaEntity>;
  let restauranteRepository: Repository<RestauranteEntity>;
  let cultura: CulturaEntity;
  let restauranteList : RestauranteEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CulturaRestauranteService],
    }).compile();

    service = module.get<CulturaRestauranteService>(CulturaRestauranteService);
    culturaRepository = module.get<Repository<CulturaEntity>>(getRepositoryToken(CulturaEntity));
    restauranteRepository = module.get<Repository<RestauranteEntity>>(getRepositoryToken(RestauranteEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    culturaRepository.clear();
    restauranteRepository.clear();

    restauranteList = [];
    for(let i = 0; i < 5; i++){
        const restaurante: RestauranteEntity = await restauranteRepository.save({
            nombre: faker.lorem.sentence(),
            estrellasMichelin: faker.datatype.number(),
            fechaConsecusion: faker.date.birthdate(),
            descripcion: faker.lorem.paragraph(),
            direccion: faker.address.direction(),
            telefono: faker.phone.number(),
            foto: faker.image.imageUrl()
        });
        restauranteList.push(restaurante);
    }

    cultura = await culturaRepository.save({
        nombre: faker.lorem.sentence(),
        descripcion: faker.lorem.paragraph(),
        restaurantes: restauranteList
    });

  }

  it('should be defined', () => {
    expect(service).toBeDefined();
  });

  it('addRestauranteCultura deberia agregar un restaurante a una cultura', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
        nombre: faker.lorem.sentence(),
        estrellasMichelin: faker.datatype.number(),
        fechaConsecusion: faker.date.birthdate(),
        descripcion: faker.lorem.paragraph(),
        direccion: faker.address.direction(),
        telefono: faker.phone.number(),
        foto: faker.image.imageUrl()
    });

    const newCultura = await culturaRepository.save({
        nombre: faker.lorem.sentence(),
        descripcion: faker.lorem.paragraph()
    });

    const result: CulturaEntity = await service.addRestauranteCultura(newCultura.id, newRestaurante.codigo);
    expect(result.restaurantes.length).toBe(1);
    expect(result.restaurantes[0]).not.toBeNull();
    expect(result.restaurantes[0].nombre).toBe(newRestaurante.nombre);

  });

  it('addRestauranteCultura deberia lanzar una excepcion por un restaurante inválido', async () => {
    const newCultura = await culturaRepository.save({
        nombre: faker.lorem.sentence(),
        descripcion: faker.lorem.paragraph()
    });

    await expect(() => service.addRestauranteCultura(newCultura.id, "0")).rejects.toHaveProperty("message", "El restaurante con el ID dado no fue encontrado");

  });


  it('addRestauranteCultura deberia lanzar una excepcion por una cultura inválida', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
        nombre: faker.lorem.sentence(),
        estrellasMichelin: faker.datatype.number(),
        fechaConsecusion: faker.date.birthdate(),
        descripcion: faker.lorem.paragraph(),
        direccion: faker.address.direction(),
        telefono: faker.phone.number(),
        foto: faker.image.imageUrl()
    });

    await expect(() => service.addRestauranteCultura("0", newRestaurante.codigo)).rejects.toHaveProperty("message", "La cultura gastronómica con el ID dado no fue encontrada");

  });


  it('findRestauranteByCulturaIdRestauranteId deberia retornar un restaurante de una cultura', async () => {
    const restaurante: RestauranteEntity = restauranteList[0];
    const storedRestaurante: RestauranteEntity = await service.findRestauranteByCulturaIdRestauranteId(cultura.id, restaurante.codigo);
    expect(storedRestaurante).not.toBeNull();
    expect(storedRestaurante.nombre).toBe(restaurante.nombre);
  });

  it('findRestauranteByCulturaIdRestauranteId deberia lanzar una excepcion por un restaurante invalido', async () => {
    await expect(()=> service.findRestauranteByCulturaIdRestauranteId(cultura.id, "0")).rejects.toHaveProperty("message", "El restaurante con el ID dado no fue encontrado");
  });


  it('findRestauranteByCulturaIdRestauranteId deberia lanzar una excepcion por una cultura invalida', async () => {
    const restaurante: RestauranteEntity = restauranteList[0];
    await expect(()=> service.findRestauranteByCulturaIdRestauranteId("0", restaurante.codigo)).rejects.toHaveProperty("message", "La cultura gastronómica con el ID dado no fue encontrado");
  });


  it('findRestauranteByCulturaIdRestauranteId deberia lanzar una excepcion por un restaurante que no esta asociado a una cultura', async () => {
    const newRestaurante: RestauranteEntity = await restauranteRepository.save({
        nombre: faker.lorem.sentence(),
        estrellasMichelin: faker.datatype.number(),
        fechaConsecusion: faker.date.birthdate(),
        descripcion: faker.lorem.paragraph(),
        direccion: faker.address.direction(),
        telefono: faker.phone.number(),
        foto: faker.image.imageUrl()
    });
 
    await expect(()=> service.findRestauranteByCulturaIdRestauranteId(cultura.id, newRestaurante.codigo)).rejects.toHaveProperty("message", "El restaurante con el ID dado no se encuentra asociado a la cultura gastronómica");
  });


  it('findRestaurantesByCulturaId deberia retornar los restaurantes de una cultura', async () => {
    const restaurantes: RestauranteEntity[] = await service.findRestaurantesByCulturaId(cultura.id);
    expect(restaurantes).not.toBeNull();
    expect(restaurantes.length).toBe(5);
  });


  it('findRestaurantesByCulturaId deberia lanzar una execepcion por una cultura invalida', async () => {
    await expect(()=> service.findRestaurantesByCulturaId("0")).rejects.toHaveProperty("message", "La cultura gastronómica con el ID dado no fue encontrado");
  });


  it('associateRestaurantesCultura deberia actualizar los restaurantes para una cultura', async () => {
    const newRestaurante: RestauranteEntity = restauranteList[0];

    const updatedCultura: CulturaEntity = await service.associateRestaurantesCultura(cultura.id, [newRestaurante]);
    expect(updatedCultura).not.toBeNull();
    expect(updatedCultura.restaurantes).not.toBeNull();
    expect(updatedCultura.restaurantes[0].nombre).toBe(newRestaurante.nombre);
  });

  it('associateRestaurantesCultura deberia arrojar una excepcion por una cultura invalida', async () => {
    const restaurante: RestauranteEntity = await restauranteRepository.save({
        nombre: faker.lorem.sentence(),
        estrellasMichelin: faker.datatype.number(),
        fechaConsecusion: faker.date.birthdate(),
        descripcion: faker.lorem.paragraph(),
        direccion: faker.address.direction(),
        telefono: faker.phone.number(),
        foto: faker.image.imageUrl()
    });

    await expect(() => service.associateRestaurantesCultura("0", [restaurante])).rejects.toHaveProperty("message", "La cultura gastronómica con el ID dado no fue encontrado");
  });

  it('associateRestaurantesCultura deberia arrojar una escepcion por un restaurante invalido', async () => {
    const newRestaurante: RestauranteEntity = restauranteList[0];
    newRestaurante.codigo = "0";

    await expect(() => service.associateRestaurantesCultura(cultura.id, [newRestaurante])).rejects.toHaveProperty("message", "El restaurantes con el ID dado no fue encontrado");
  });

  it('deleteRestauranteCultura deberia eliminar un restaurante de una cultura', async () => {
    const restaurante: RestauranteEntity = restauranteList[0];

    await service.deleteRestauranteCultura(cultura.id, restaurante.codigo);

    const storedCultura: CulturaEntity = await culturaRepository.findOne({ where: { id: cultura.id }, relations: ["restaurantes"] });
    const deletedRestaurante: RestauranteEntity = storedCultura.restaurantes.find(a => a.codigo === restaurante.codigo);

    expect(deletedRestaurante).toBeUndefined();

  });

  it('deleteRestauranteCultura deberia lanzar una excepcion por un restaurante invalido', async () => {
    await expect(() => service.deleteRestauranteCultura(cultura.id, "0")).rejects.toHaveProperty("message", "El restaurante con el ID dado no fue encontrado");
  });


  it('deleteRestauranteCultura deberia lanzar una excepcion por una cultura invalida', async () => {
    const restaurante: RestauranteEntity = restauranteList[0];
    await expect(() => service.deleteRestauranteCultura("0", restaurante.codigo)).rejects.toHaveProperty("message", "La cultura gastronómica con el ID dado no fue encontrado");
  });

  it('deleteRestauranteCultura deberia lanzar una excepcion por un restaurante no asociado', async () => {
    const restaurante: RestauranteEntity = await restauranteRepository.save({
        nombre: faker.lorem.sentence(),
        estrellasMichelin: faker.datatype.number(),
        fechaConsecusion: faker.date.birthdate(),
        descripcion: faker.lorem.paragraph(),
        direccion: faker.address.direction(),
        telefono: faker.phone.number(),
        foto: faker.image.imageUrl()
    });

    await expect(() => service.deleteRestauranteCultura(cultura.id, restaurante.codigo)).rejects.toHaveProperty("message", "El restaurante con el ID dado no se encuentra asociado a la cultura gastronómica");
  });





});
