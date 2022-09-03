import { Test, TestingModule } from '@nestjs/testing';
import { CiudadService } from './ciudad.service';
import { CiudadEntity } from './ciudad.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('CiudadService', () => {
  let service: CiudadService;
  let repository: Repository<CiudadEntity>;
  let listaCiudades: CiudadEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadService],
    }).compile();

    service = module.get<CiudadService>(CiudadService);
    repository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    await seedDatabase();    
  });

  const seedDatabase = async () => {
    repository.clear();
    listaCiudades = [];
    for(let i = 0; i < 5; i++){
        const ciudad: CiudadEntity = await repository.save({
        nombre: faker.lorem.sentence()})
        listaCiudades.push(ciudad);
    }
  }  

  it('Deberia estar definido', () => {
    expect(service).toBeDefined();
  });

  it('findAll deberia retornar todas las ciudades', async () => {
    const ciudades: CiudadEntity[] = await service.findAll();
    expect(ciudades).not.toBeNull();
    expect(ciudades).toHaveLength(listaCiudades.length);
  });  

  it('findOne deberia retornar una ciudad por ID', async () => {
    const ciudadAlmacenada: CiudadEntity = listaCiudades[0];
    const museum: CiudadEntity = await service.findOne(ciudadAlmacenada.codigo);
    expect(museum).not.toBeNull();
    expect(museum.nombre).toEqual(ciudadAlmacenada.nombre)
  }); 

  it('findOne deberia arrojar una excepcion por una ciudad invalida', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("mensaje", "La ciudad con el ID dado no fue encontrada")
  });  

  it('create deberia retornar una nueva ciudad', async () => {
    const ciudad: CiudadEntity = {
      codigo: "",
      nombre: faker.lorem.sentence()
    }

    const nuevaCiudad: CiudadEntity = await service.create(ciudad);
    expect(nuevaCiudad).not.toBeNull();

    const ciudadAlmacenada: CiudadEntity = await repository.findOne({where: {codigo: nuevaCiudad.codigo}})
    expect(ciudadAlmacenada).not.toBeNull();
    expect(ciudadAlmacenada.nombre).toEqual(nuevaCiudad.nombre)
  });  

  it('update deberia modificar una ciudad', async () => {
    const ciudad: CiudadEntity = listaCiudades[0];
    ciudad.nombre = "New name";
  
    const ciudadActualizado: CiudadEntity = await service.update(ciudad.codigo, ciudad);
    expect(ciudadActualizado).not.toBeNull();
  
    const ciudadAlmacenada: CiudadEntity = await repository.findOne({ where: { codigo: ciudad.codigo } })
    expect(ciudadAlmacenada).not.toBeNull();
    expect(ciudadAlmacenada.nombre).toEqual(ciudad.nombre)
  });

  it('update deberia arrojas una escepcion por una ciudad invialida', async () => {
    let ciudad: CiudadEntity = listaCiudades[0];
    ciudad = {
      ...ciudad, nombre: "New name"
    }
    await expect(() => service.update("0", ciudad)).rejects.toHaveProperty("mensaje", "La ciudad con el ID dado no fue encontrada")
  });  

  it('delete deberia eliminar una ciudad', async () => {
    const ciudad: CiudadEntity = listaCiudades[0];
    await service.delete(ciudad.codigo);
  
    const ciudadBorrado: CiudadEntity = await repository.findOne({ where: { codigo: ciudad.codigo } })
    expect(ciudadBorrado).toBeNull();
  });

  it('delete deberia arrojas una excepcion por una ciudad invalida', async () => {
    const ciudad: CiudadEntity = listaCiudades[0];
    await service.delete(ciudad.codigo);
    await expect(() => service.delete("0")).rejects.toHaveProperty("mensaje", "La ciudad con el ID dado no fue encontrada")
  });

});
