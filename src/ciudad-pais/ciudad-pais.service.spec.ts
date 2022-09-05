/* eslint-disable prettier/prettier */
import { Test, TestingModule } from '@nestjs/testing';
import { PaisEntity } from '../pais/pais.entity';
import { Repository } from 'typeorm';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CiudadPaisService } from './ciudad-pais.service';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('CiudadPaisService', () => {
  let service: CiudadPaisService;
  let ciudadRepository: Repository<CiudadEntity>;
  let paisRepository: Repository<PaisEntity>;
  let ciudad: CiudadEntity;
  let ListaPaises : PaisEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CiudadPaisService],
    }).compile();

    service = module.get<CiudadPaisService>(CiudadPaisService);
    ciudadRepository = module.get<Repository<CiudadEntity>>(getRepositoryToken(CiudadEntity));
    paisRepository = module.get<Repository<PaisEntity>>(getRepositoryToken(PaisEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    paisRepository.clear();
    ciudadRepository.clear();

    ListaPaises = [];
    for(let i = 0; i < 1; i++){
        const pais: PaisEntity = await paisRepository.save({
          nombre: faker.company.name() 
        })
        ListaPaises.push(pais);
    }

    ciudad = await ciudadRepository.save({
      nombre: faker.lorem.sentence(),
      pais: ListaPaises[0]
    })
  }

  it('Deberia estar definido', () => {
    expect(service).toBeDefined();
  });

  it('addPaisCiudad deberia agregar un pais a una ciudad', async () => {
    const newPais: PaisEntity = await paisRepository.save({
      nombre: faker.company.name() 
    });

    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.lorem.sentence(),
      pais: null
    })

    const result: CiudadEntity = await service.addPaisCiudad(newCiudad.codigo, newPais.codigo);
    
    expect(result.pais).not.toBeNull();
    expect(result.pais.nombre).toBe(newPais.nombre)
  });

  it('addPaisCiudad deberia arrojar una excepcion por un pais invalido', async () => {
    const newCiudad: CiudadEntity = await ciudadRepository.save({
      nombre: faker.lorem.sentence(),
      pais: null
    })

    await expect(() => service.addPaisCiudad(newCiudad.codigo, "0")).rejects.toHaveProperty("mensaje", "El pais con el ID dado no fue encontrado");
  });

  it('addPaisCiudad deberia arrojar una excepcion por una ciudad invalida', async () => {
    const newPais: PaisEntity = await paisRepository.save({
      nombre: faker.company.name() 
    });

    await expect(() => service.addPaisCiudad("0", newPais.codigo)).rejects.toHaveProperty("mensaje", "La ciudad con el ID dado no fue encontrada");
  });

  it('findPaisByCiudadIdPaisId deberia retornar un pais por ciudad', async () => {
    const pais: PaisEntity = ListaPaises[0];
    const storedPais: PaisEntity = await service.findPaisByCiudadIdPaisId(ciudad.codigo, pais.codigo, )
    expect(storedPais).not.toBeNull();
    expect(storedPais.nombre).toBe(pais.nombre);
  });

  it('findPaisByCiudadIdPaisId deberia arrojar una excepcion por un pais invalida', async () => {
    await expect(()=> service.findPaisByCiudadIdPaisId(ciudad.codigo, "0")).rejects.toHaveProperty("mensaje", "El pais con el ID dado no fue encontrado"); 
  });

  it('findPaisByCiudadIdPaisId deberia arrojar una excepcion por una ciudad invalido', async () => {
    const pais: PaisEntity = ListaPaises[0]; 
    await expect(()=> service.findPaisByCiudadIdPaisId("0", pais.codigo)).rejects.toHaveProperty("mensaje", "La ciudad con el ID dado no fue encontrada"); 
  });

  it('findPaisByCiudadIdPaisId deberia arrojar una excepcion por un pais no asociada al ciudad', async () => {
    const newPais: PaisEntity = await paisRepository.save({
      nombre: faker.company.name() 
    });

    await expect(()=> service.findPaisByCiudadIdPaisId(ciudad.codigo, newPais.codigo)).rejects.toHaveProperty("mensaje", "El pais con el ID dado no esta asociada a la ciudad"); 
  });

  it('findPaissByCiudadId deberia retornar un pais por ciudad', async ()=>{
    const pais: PaisEntity = await service.findPaissByCiudadId(ciudad.codigo);
    expect(pais).not.toBeNull()
  });

  it('findPaissByCiudadId deberia arrojar una excepcion por una ciudad invalida', async () => {
    await expect(()=> service.findPaissByCiudadId("0")).rejects.toHaveProperty("mensaje", "La ciudad con el ID dado no fue encontrada"); 
  });

  it('associatePaissCiudad deberia actualizar pais para una ciudad', async () => {
    const newPais: PaisEntity = ListaPaises[0];

    const updatedCiudad: CiudadEntity = await service.associatePaissCiudad(ciudad.codigo, newPais);
    expect(updatedCiudad.pais).not.toBeNull()

    expect(updatedCiudad.pais.nombre).toBe(newPais.nombre);
  });

  it('associatePaissCiudad deberia arrojar una excepcion por una ciudad invalida', async () => {
    const newPais: PaisEntity = await paisRepository.save({
      nombre: faker.company.name() 
    });

    await expect(()=> service.associatePaissCiudad("0", newPais)).rejects.toHaveProperty("mensaje", "La ciudad con el ID dado no fue encontrada"); 
  });

  it('associatePaissCiudad deberia arrojar una escepcion por un pais invalida', async () => {
    const newPais: PaisEntity = ListaPaises[0];
    newPais.codigo = "0";

    await expect(()=> service.associatePaissCiudad(ciudad.codigo, newPais)).rejects.toHaveProperty("mensaje", "El pais con el ID dado no fue encontrado"); 
  });

  it('deletePaisToCiudad deberia eliminar un pais de una ciudad', async () => {
    const pais: PaisEntity = ListaPaises[0];
    
    await service.deletePaisCiudad(ciudad.codigo, pais.codigo);

    const storedCiudad: CiudadEntity = await ciudadRepository.findOne({where: {codigo: ciudad.codigo}, relations: ["pais"]});
    const deletedPais: PaisEntity = storedCiudad.pais;

    expect(deletedPais).toBeNull();

  });

  it('deletePaisToCiudad deberia retornar una excepcion por un pais invalida', async () => {
    await expect(()=> service.deletePaisCiudad(ciudad.codigo, "0")).rejects.toHaveProperty("mensaje", "El pais con el ID dado no fue encontrado"); 
  });

  it('deletePaisToCiudad deberia arrojar una excepcion por una ciudad invalido', async () => {
    const pais: PaisEntity = ListaPaises[0];
    await expect(()=> service.deletePaisCiudad("0", pais.codigo)).rejects.toHaveProperty("mensaje", "La ciudad con el ID dado no fue encontrada"); 
  });

  it('deletePaisToCiudad deberia arrojar una excepcion por un pais no asociada', async () => {
    const newPais: PaisEntity = await paisRepository.save({
      nombre: faker.company.name() 
    });

    await expect(()=> service.deletePaisCiudad(ciudad.codigo, newPais.codigo)).rejects.toHaveProperty("mensaje", "El pais con el ID dado no esta asociada a la ciudad"); 
  }); 

});
