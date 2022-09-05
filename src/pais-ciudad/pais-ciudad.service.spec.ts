import { Test, TestingModule } from '@nestjs/testing';
import { PaisCiudadService } from './pais-ciudad.service';
import { PaisEntity } from '../pais/pais.entity';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('PaisCiudadService', () => {
  let service: PaisCiudadService;
  let ciudadRepository: Repository<CiudadEntity>;
  let paisRepository: Repository<PaisEntity>;
  let ciudadesList: CiudadEntity[];
  let pais: PaisEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [PaisCiudadService],
    }).compile();

    service = module.get<PaisCiudadService>(PaisCiudadService);
    ciudadRepository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    paisRepository = module.get<Repository<PaisEntity>>(getRepositoryToken(PaisEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    paisRepository.clear();
    ciudadRepository.clear();

    ciudadesList = [];
    pais = await paisRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      ciudades: ciudadesList
    })

    for (let i = 0; i < 5; i++) {
      const ciudad: CiudadEntity = await ciudadRepository.save({
        nombre: faker.lorem.sentence(),
        pais: pais
      })
      ciudadesList.push(ciudad);
    }

    pais = await paisRepository.save({
      nombre: faker.lorem.sentence(),
      ciudades: ciudadesList
    })
  }

  it('Deberia estar definido', () => {
    expect(service).toBeDefined();
  });

  it('addCiudadPais deberia agregar una ciudad a una pais', async () => {
    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.lorem.sentence()
    });

    const newPais: PaisEntity = await paisRepository.save({
      nombre: faker.lorem.sentence(),
      ciudades: null
    })

    const result: PaisEntity = await service.addCiudadPais(newPais.codigo, newCiudad.codigo);

    expect(result.ciudades).not.toBeNull();
    expect(result.ciudades[0].nombre).toBe(newCiudad.nombre)
  });

  it('addCiudadPais deberia arrojar una excepcion por una ciudad invalida', async () => {
    const newPais: PaisEntity = await paisRepository.save({
      nombre: faker.lorem.sentence(),
      ciudades: null
    })

    await expect(() => service.addCiudadPais(newPais.codigo, "0")).rejects.toHaveProperty("mensaje", "La ciudad con el ID dado no fue encontrada");
  });

  it('addCiudadPais deberia arrojar una excepcion por pais invalido', async () => {
    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.paragraph(),
      fotoPlato: faker.image.imageUrl(),
      procesoPreparacion: faker.lorem.sentence(),
      videoPreparacion: faker.internet.url(),
      tipoCiudad: faker.lorem.word(),
      pais: pais
    });

    await expect(() => service.addCiudadPais("0", newCiudad.codigo)).rejects.toHaveProperty("mensaje", "El pais con el ID dado no fue encontrado");
  });

  it('findCiudadByPaisIdCiudadId deberia retornar un pais de ciudad', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    const storedPais: CiudadEntity = await service.findCiudadByPaisIdCiudadId(pais.codigo, ciudad.codigo,)
    expect(storedPais).not.toBeNull();
  });

  it('findCiudadByPaisIdCiudadId deberia arrojar una excepcion por un pais invalido', async () => {
    await expect(() => service.findCiudadByPaisIdCiudadId(pais.codigo, "0")).rejects.toHaveProperty("mensaje", "La ciudad con el ID dado no fue encontrada");
  });

  it('findCiudadByPaisIdCiudadId deberia arrojar una excepcion por una pais invalido', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    await expect(() => service.findCiudadByPaisIdCiudadId("0", ciudad.codigo)).rejects.toHaveProperty("mensaje", "El pais con el ID dado no fue encontrado");
  });

  it('findCiudadByPaisIdCiudadId deberia arrojar una excepcion por una ciudad no asociada a pais', async () => {
    const newPais: PaisEntity = await paisRepository.save({
      nombre: faker.lorem.sentence(),
      ciudades: null
    })

    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.company.name(),
      pais: newPais
    });

    await expect(() => service.findCiudadByPaisIdCiudadId(pais.codigo, newCiudad.codigo)).rejects.toHaveProperty("mensaje", "La ciudad con el ID dado no se encuentra asociada al pais");
  });

  it('findCiudadesByPaisId deberia retornar ciudades por pais', async () => {
    const ciudades: CiudadEntity[] = await service.findCiudadesByPaisId(pais.codigo);
    expect(ciudades).not.toBeNull()
  });

  it('findCiudadesByPaisId deberia arrojar una excepcion por una pais invalida', async () => {
    await expect(() => service.findCiudadesByPaisId("0")).rejects.toHaveProperty("mensaje", "El pais con el ID dado no fue encontrado");
  });

  it('associateCiudadesPais deberia actualizar la ciudad para una pais', async () => {
    const newCiudad: CiudadEntity = ciudadesList[0];

    const updatedPais: PaisEntity = await service.associateCiudadesPais(pais.codigo, [newCiudad]);
    expect(updatedPais.ciudades).not.toBeNull()

    expect(updatedPais.ciudades[0].nombre).toBe(newCiudad.nombre);
  });

  it('associateCiudadesPais deberia arrojar una excepcion por una pais invalido', async () => {
    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.paragraph(),
      fotoPlato: faker.image.imageUrl(),
      procesoPreparacion: faker.lorem.sentence(),
      videoPreparacion: faker.internet.url(),
      tipoCiudad: faker.lorem.word(),
      pais: pais
    });

    await expect(() => service.associateCiudadesPais("0", [newCiudad])).rejects.toHaveProperty("mensaje", "El pais con el ID dado no fue encontrado");
  });

  it('associateCiudadesPais deberia arrojar una escepcion por una ciudad invalida', async () => {
    const newCiudad: CiudadEntity = ciudadesList[0];
    newCiudad.codigo = "0";

    await expect(() => service.associateCiudadesPais(pais.codigo, [newCiudad])).rejects.toHaveProperty("mensaje", "La ciudad con el ID dado no fue encontrada");
  });

  it('deleteCiudadPais deberia eliminar una ciudad de una pais', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];

    await service.deleteCiudadPais(pais.codigo, ciudad.codigo);

    const storedPais: PaisEntity = await paisRepository.findOne({ where: { codigo: pais.codigo }, relations: ["ciudades"] });
    const deletedCiudad: CiudadEntity = storedPais.ciudades.find(a => a.codigo === ciudad.codigo);

    expect(deletedCiudad).toBeUndefined();

  });

  it('deleteCiudadPais deberia retornar una excepcion por una ciudad invalida', async () => {
    await expect(() => service.deleteCiudadPais(pais.codigo, "0")).rejects.toHaveProperty("mensaje", "La ciudad con el ID dado no fue encontrada");
  });

  it('deleteCiudadPais deberia arrojar una excepcion por una pais invalido', async () => {
    const ciudad: CiudadEntity = ciudadesList[0];
    await expect(() => service.deleteCiudadPais("0", ciudad.codigo)).rejects.toHaveProperty("mensaje", "El pais con el ID dado no fue encontrado");
  });

  it('deleteCiudadPais deberia arrojar una excepcion por una ciudad no asociada', async () => {
    const newPais: PaisEntity = await paisRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      ciudades: null
    })

    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.paragraph(),
      fotoPlato: faker.image.imageUrl(),
      procesoPreparacion: faker.lorem.sentence(),
      videoPreparacion: faker.internet.url(),
      tipoCiudad: faker.lorem.word(),
      pais: newPais
    });

    await expect(() => service.deleteCiudadPais(pais.codigo, newCiudad.codigo)).rejects.toHaveProperty("mensaje", "La ciudad con el ID dado no se encuentra asociada al pais");
  });



});


