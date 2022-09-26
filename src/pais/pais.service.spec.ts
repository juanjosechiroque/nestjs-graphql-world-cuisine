import { Test, TestingModule } from '@nestjs/testing';
import { PaisService } from './pais.service';
import { PaisEntity } from './pais.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CacheModule } from '@nestjs/common';

describe('PaisService', () => {
  let service: PaisService;
  let repository: Repository<PaisEntity>;
  let listaPaises: PaisEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig(), CacheModule.register()],
      providers: [PaisService],
    }).compile();

    service = module.get<PaisService>(PaisService);
    repository = module.get<Repository<PaisEntity>>(getRepositoryToken(PaisEntity));
    await seedDatabase();    
  });

  const seedDatabase = async () => {
    repository.clear();
    listaPaises = [];
    for(let i = 0; i < 5; i++){
        const pais: PaisEntity = await repository.save({
        nombre: faker.lorem.sentence(),
        ciudades: []
        })
        listaPaises.push(pais);
    }
  }  

  it('Deberia estar definido', () => {
    expect(service).toBeDefined();
  });

  it('findAll deberia retornar todos los paises', async () => {
    const paises: PaisEntity[] = await service.findAll();
    expect(paises).not.toBeNull();
    expect(paises).toHaveLength(listaPaises.length);
  });  

  it('findOne deberia retornar un pais por ID', async () => {
    const paisAlmacenado: PaisEntity = listaPaises[0];
    const pais: PaisEntity = await service.findOne(paisAlmacenado.codigo);
    expect(pais).not.toBeNull();
    expect(pais.nombre).toEqual(paisAlmacenado.nombre)
  }); 

  it('findOne deberia arrojar una excepcion por un pais invalido', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "El pais con el ID dado no fue encontrado")
  });  

  it('create deberia retornar un nuevo pais', async () => {
    const pais: PaisEntity = {
      codigo: "",
      nombre: faker.lorem.sentence(),
      ciudades: []
    }

    const nuevaPais: PaisEntity = await service.create(pais);
    expect(nuevaPais).not.toBeNull();

    const paisAlmacenado: PaisEntity = await repository.findOne({where: {codigo: nuevaPais.codigo}})
    expect(paisAlmacenado).not.toBeNull();
    expect(paisAlmacenado.nombre).toEqual(nuevaPais.nombre)
  });  

  it('update deberia modificar un pais', async () => {
    const pais: PaisEntity = listaPaises[0];
    pais.nombre = "New name";
  
    const paisActualizado: PaisEntity = await service.update(pais.codigo, pais);
    expect(paisActualizado).not.toBeNull();
  
    const paisAlmacenado: PaisEntity = await repository.findOne({ where: { codigo: pais.codigo } })
    expect(paisAlmacenado).not.toBeNull();
    expect(paisAlmacenado.nombre).toEqual(pais.nombre)
  });

  it('update deberia arrojar una excepcion por un pais invalido', async () => {
    let pais: PaisEntity = listaPaises[0];
    pais = {
      ...pais, nombre: "New name"
    }
    await expect(() => service.update("0", pais)).rejects.toHaveProperty("message", "El pais con el ID dado no fue encontrado")
  });  

  it('delete deberia eliminar un pais', async () => {
    const pais: PaisEntity = listaPaises[0];
    await service.delete(pais.codigo);
  
    const paisBorrado: PaisEntity = await repository.findOne({ where: { codigo: pais.codigo } })
    expect(paisBorrado).toBeNull();
  });

  it('delete deberia arrojar una excepcion por un pais invalido', async () => {
    const pais: PaisEntity = listaPaises[0];
    await service.delete(pais.codigo);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "El pais con el ID dado no fue encontrado")
  });

});
