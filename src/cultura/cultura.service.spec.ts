import { Test, TestingModule } from '@nestjs/testing';
import { CulturaService } from './cultura.service';
import { CulturaEntity } from './cultura.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';

describe('CulturaService', () => {
  let service: CulturaService;
  let repository: Repository<CulturaEntity>;
  let listaCulturas: CulturaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CulturaService],
    }).compile();

    service = module.get<CulturaService>(CulturaService);
    repository = module.get<Repository<CulturaEntity>>(getRepositoryToken(CulturaEntity));
    await seedDatabase();    
  });

  const seedDatabase = async () => {
    repository.clear();
    listaCulturas = [];
    for(let i = 0; i < 5; i++){
        const cultura: CulturaEntity = await repository.save({
        nombre: faker.lorem.sentence(),
        descripcion: faker.lorem.paragraph()})
        listaCulturas.push(cultura);
    }
  }  

  it('Deberia estar definido', () => {
    expect(service).toBeDefined();
  });

  it('findAll deberia retornar todas las culturas', async () => {
    const culturas: CulturaEntity[] = await service.findAll();
    expect(culturas).not.toBeNull();
    expect(culturas).toHaveLength(listaCulturas.length);
  });  

  it('findOne deberia retornar una cultura por ID', async () => {
    const culturaAlmacenada: CulturaEntity = listaCulturas[0];
    const cultura: CulturaEntity = await service.findOne(culturaAlmacenada.id);
    expect(cultura).not.toBeNull();
    expect(cultura.nombre).toEqual(culturaAlmacenada.nombre)
  }); 

  it('findOne deberia arrojar una excepcion por una cultura invalida', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("message", "La cultura gastronomica con el ID dado no fue encontrada")
  });  

  it('create deberia retornar una nueva cultura', async () => {
    const cultura: CulturaEntity = {
      id: "",
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      recetas: [],
      paises: [],
      restaurantes: [],
      productos: []
    }

    const nuevaCultura: CulturaEntity = await service.create(cultura);
    expect(nuevaCultura).not.toBeNull();

    const culturaAlmacenada: CulturaEntity = await repository.findOne({where: {id: nuevaCultura.id}})
    expect(culturaAlmacenada).not.toBeNull();
    expect(culturaAlmacenada.nombre).toEqual(nuevaCultura.nombre)
    expect(culturaAlmacenada.descripcion).toEqual(nuevaCultura.descripcion)
  });  

  it('update deberia modificar una cultura', async () => {
    const cultura: CulturaEntity = listaCulturas[0];
    cultura.nombre = "New name";
    cultura.descripcion = "New description";
  
    const culturaActualizado: CulturaEntity = await service.update(cultura.id, cultura);
    expect(culturaActualizado).not.toBeNull();
  
    const culturaAlmacenada: CulturaEntity = await repository.findOne({ where: { id: cultura.id } })
    expect(culturaAlmacenada).not.toBeNull();
    expect(culturaAlmacenada.nombre).toEqual(cultura.nombre)
    expect(culturaAlmacenada.descripcion).toEqual(cultura.descripcion)
  });

  it('update deberia arrojar una excepcion por una cultura invalida', async () => {
    let cultura: CulturaEntity = listaCulturas[0];
    cultura = {
      ...cultura, nombre: "New name"
    }
    await expect(() => service.update("0", cultura)).rejects.toHaveProperty("message", "La cultura gastronomica con el ID dado no fue encontrada")
  });  

  it('delete deberia eliminar una cultura', async () => {
    const cultura: CulturaEntity = listaCulturas[0];
    await service.delete(cultura.id);
  
    const culturaBorrado: CulturaEntity = await repository.findOne({ where: { id: cultura.id } })
    expect(culturaBorrado).toBeNull();
  });

  it('delete deberia arrojar una excepcion por una cultura invalida', async () => {
    const cultura: CulturaEntity = listaCulturas[0];
    await service.delete(cultura.id);
    await expect(() => service.delete("0")).rejects.toHaveProperty("message", "La cultura gastronomica con el ID dado no fue encontrada")
  });

});
