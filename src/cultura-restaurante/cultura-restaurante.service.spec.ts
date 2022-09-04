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

    await expect(() => service.addRestauranteCultura(newCultura.id, "0")).rejects.toHaveProperty("mensaje", "El restaurante con el ID dado no fue encontrado");

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

    await expect(() => service.addRestauranteCultura("0", newRestaurante.codigo)).rejects.toHaveProperty("mensaje", "La cultura gastronómica con el ID dado no fue encontrada");

  });


  it('findRestauranteByCulturaIdRestauranteId deberia retornar un restaurante de una cultura', async () => {
    const restaurante: RestauranteEntity = restauranteList[0];
    const storedRestaurante: RestauranteEntity = await service.findRestauranteByCulturaIdRestauranteId(cultura.id, restaurante.codigo);
    expect(storedRestaurante).not.toBeNull();
    expect(storedRestaurante.nombre).toBe(restaurante.nombre);
  });

  it('findRestauranteByCulturaIdRestauranteId deberia lanzar una excepcion por un restaurante invalido', async () => {
    await expect(()=> service.findRestauranteByCulturaIdRestauranteId(cultura.id, "0")).rejects.toHaveProperty("mensaje", "El restaurante con el ID dado no fue encontrado");
  });


  it('findRestauranteByCulturaIdRestauranteId deberia lanzar una excepcion por una cultura invalida', async () => {
    const restaurante: RestauranteEntity = restauranteList[0];
    await expect(()=> service.findRestauranteByCulturaIdRestauranteId("0", restaurante.codigo)).rejects.toHaveProperty("mensaje", "La cultura gastronómica con el ID dado no fue encontrado");
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
 
    await expect(()=> service.findRestauranteByCulturaIdRestauranteId(cultura.id, newRestaurante.codigo)).rejects.toHaveProperty("mensaje", "El restaurante con el ID dado no se encuentra asociado a la cultura gastronómica");
  });


});
