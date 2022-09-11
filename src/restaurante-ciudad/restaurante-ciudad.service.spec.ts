import { Test, TestingModule } from '@nestjs/testing';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { Repository } from 'typeorm';
import { RestauranteCiudadService } from './restaurante-ciudad.service';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('RestauranteCiudadService', () => {
  let service: RestauranteCiudadService;
  let restauranteRepository: Repository<RestauranteEntity>;
  let ciudadRepository: Repository<CiudadEntity>;
  let restaurante: RestauranteEntity;
  let ciudadList: CiudadEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RestauranteCiudadService],
    }).compile();

    service = module.get<RestauranteCiudadService>(RestauranteCiudadService);
    restauranteRepository = module.get<Repository<RestauranteEntity>>(getRepositoryToken(RestauranteEntity));
    ciudadRepository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    await seedDatabase();

  });

  const seedDatabase = async () => {
    restauranteRepository.clear();
    ciudadRepository.clear();

    ciudadList = [];
    for (let i = 0; i < 2; i++) {
        const ciudad: CiudadEntity = await ciudadRepository.save({
            nombre: faker.lorem.sentence()
        });
        ciudadList.push(ciudad);
    }

    restaurante = await restauranteRepository.save({
        nombre: faker.lorem.sentence(),
        estrellasMichelin: faker.datatype.number(),
        fechaConsecusion: faker.date.birthdate(),
        descripcion: faker.lorem.paragraph(),
        direccion: faker.address.direction(),
        telefono: faker.phone.number(),
        foto: faker.image.imageUrl(),
        ciudad: ciudadList[0]
    });

  }

  it('should be defined', () => {
    
    expect(service).toBeDefined();

  });

  it('addCiudadRestaurante deberia asignar una ciudad a un restaurante', async () => {
    const newCiudad: CiudadEntity = await ciudadRepository.save({
        nombre: faker.lorem.sentence()
    });

    const newRestaurante = await restauranteRepository.save({
        nombre: faker.lorem.sentence(),
        estrellasMichelin: faker.datatype.number(),
        fechaConsecusion: faker.date.birthdate(),
        descripcion: faker.lorem.paragraph(),
        direccion: faker.address.direction(),
        telefono: faker.phone.number(),
        foto: faker.image.imageUrl()
    });

    const result: RestauranteEntity = await service.addCiudadRestaurante(newRestaurante.codigo, newCiudad.codigo);
    
    expect(result).not.toBeNull();
    expect(result.ciudad).not.toBeNull();
    expect(result.ciudad.nombre).toBe(newCiudad.nombre);
  });

  it('addCiudadRestaurante deberia lanzar una excepcion por una ciudad invalida', async () => {
    const newRestaurante = await restauranteRepository.save({
        nombre: faker.lorem.sentence(),
        estrellasMichelin: faker.datatype.number(),
        fechaConsecusion: faker.date.birthdate(),
        descripcion: faker.lorem.paragraph(),
        direccion: faker.address.direction(),
        telefono: faker.phone.number(),
        foto: faker.image.imageUrl()
    });

    await expect(() => service.addCiudadRestaurante(newRestaurante.codigo, "0")).rejects.toHaveProperty("message", "La ciudad con el ID dado no fue encontrada");
  });


  it('addCiudadRestaurante deberia lanzar una excepcion por un restaurante invalido', async () => {
    const newCiudad: CiudadEntity = await ciudadRepository.save({
        nombre: faker.lorem.sentence()
    });

    await expect(() => service.addCiudadRestaurante("0", newCiudad.codigo)).rejects.toHaveProperty("message", "El restaurante con el ID dado no fue encontrado");
  });

  it('findCiudadByRestauranteIdCiudadId deberia retornar la ciudad de un restaurant', async () => {
    const ciudad: CiudadEntity = ciudadList[0];
    const storedCiudad: CiudadEntity = await service.findCiudadByRestauranteIdCiudadId(restaurante.codigo, ciudad.codigo);
    expect(storedCiudad).not.toBeNull();
    expect(storedCiudad.nombre).toBe(ciudad.nombre);
  });


  it('findCiudadByRestauranteIdCiudadId deberia lanzar una excepcion por una ciudad invalida', async () => {
    await expect(()=> service.findCiudadByRestauranteIdCiudadId(restaurante.codigo, "0")).rejects.toHaveProperty("message", "La ciudad con el ID dado no fue encontrada"); 
  });


  it('findCiudadByRestauranteIdCiudadId deberia lanzar una excepcion por un restaurante invalido', async () => {
    const ciudad: CiudadEntity = ciudadList[0]; 
    await expect(()=> service.findCiudadByRestauranteIdCiudadId("0", ciudad.codigo)).rejects.toHaveProperty("message", "El restaurante con el ID dado no fue encontrado"); 
  });


  it('findCiudadByRestauranteIdCiudadId deberia lanzar una excepcion por una ciudad no asociada al restaurante', async () => {
    const newCiudad: CiudadEntity = await ciudadRepository.save({
        nombre: faker.lorem.sentence()
    });

    await expect(()=> service.findCiudadByRestauranteIdCiudadId(restaurante.codigo, newCiudad.codigo)).rejects.toHaveProperty("message", "La ciudad con el ID dado no esta asociada al restaurante"); 
  });


  it('findCiudadByRestauranteId deberia retornar la categoria de un restaurante', async ()=>{
    const ciudad: CiudadEntity = await service.findCiudadByRestauranteId(restaurante.codigo);
    expect(ciudad.codigo).toEqual(ciudadList[0].codigo);
  });


  it('findCiudadByRestauranteId deberia lanzar una excepcion por un restaurante invalido', async () => {
    await expect(()=> service.findCiudadByRestauranteId("0")).rejects.toHaveProperty("message", "El restaurante con el ID dado no fue encontrado"); 
  });


  it('associateCiudadRestaurante deberia actualizar la categoria de producto para un producto', async () => {
    const newCiudad: CiudadEntity = ciudadList[1]; 

    const updatedRestaurante: RestauranteEntity = await service.associateCiudadRestaurante(restaurante.codigo, newCiudad.codigo);
    expect(updatedRestaurante.ciudad).not.toBeNull()
    expect(updatedRestaurante.ciudad.nombre).toBe(newCiudad.nombre);
  });

  it('associateCiudadRestaurante deberia arrojar una excepcion por un producto invalido', async () => {
    const newCiudad = ciudadList[0];

    await expect(()=> service.associateCiudadRestaurante("0", newCiudad.codigo)).rejects.toHaveProperty("message", "El restaurante con el ID dado no fue encontrado"); 
  });


  it('associateCiudadRestaurante deberia arrojar una escepcion por una categoria de producto invalida', async () => {
    const newCiudad: CiudadEntity = ciudadList[0];
    newCiudad.codigo = "0";

    await expect(()=> service.associateCiudadRestaurante(restaurante.codigo, newCiudad.codigo)).rejects.toHaveProperty("message", "La ciudad con el ID dado no fue encontrada"); 
  });


  it('deleteCiudadRestaurante deberia eliminar la ciudad de un restaurante', async () => {
    const ciudad: CiudadEntity = ciudadList[0]; 
    
    await service.deleteCiudadRestaurante(restaurante.codigo, ciudad.codigo);

    const storedRestaurante: RestauranteEntity = await restauranteRepository.findOne({where: {codigo: restaurante.codigo}, relations: ["ciudad"]});
    const deletedCiudad: CiudadEntity = storedRestaurante.ciudad;

    expect(deletedCiudad).toBeNull();

  });


  it('deleteCiudadRestaurante deberia retornar una excepcion por una ciudad invalida', async () => {
    await expect(()=> service.deleteCiudadRestaurante(restaurante.codigo, "0")).rejects.toHaveProperty("message", "La ciudad con el ID dado no fue encontrada"); 
  });


  it('deleteCiudadRestaurante deberia arrojar una excepcion por un restaurante invalido', async () => {
    const ciudad: CiudadEntity = ciudadList[0]; 
    await expect(()=> service.deleteCiudadRestaurante("0", ciudad.codigo)).rejects.toHaveProperty("message", "El restaurante con el ID dado no fue encontrado"); 
  });


  it('deleteCiudadRestaurante deberia arrojar una excepcion por una categoria de producto no asociada', async () => {
    const newCiudad: CiudadEntity = await ciudadRepository.save({
        nombre: faker.lorem.sentence()
    });

    await expect(()=> service.deleteCiudadRestaurante(restaurante.codigo, newCiudad.codigo)).rejects.toHaveProperty("message", "La ciudad con el ID dado no esta asociada al restaurante"); 
  }); 
  

});
