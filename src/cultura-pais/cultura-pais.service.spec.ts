import { Test, TestingModule } from '@nestjs/testing';
import { CulturaPaisService } from './cultura-pais.service';
import { CulturaEntity } from '../cultura/cultura.entity';
import { PaisEntity } from '../pais/pais.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('CulturaPaisService', () => {
  let service: CulturaPaisService;
  let paisRepository: Repository<PaisEntity>;
  let culturaRepository: Repository<CulturaEntity>;
  let paisesList: PaisEntity[];
  let cultura: CulturaEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CulturaPaisService],
    }).compile();

    service = module.get<CulturaPaisService>(CulturaPaisService);
    paisRepository = module.get<Repository<PaisEntity>>(getRepositoryToken(PaisEntity));
    culturaRepository = module.get<Repository<CulturaEntity>>(getRepositoryToken(CulturaEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    culturaRepository.clear();
    paisRepository.clear();

    paisesList = [];
    for (let i = 0; i < 5; i++) {
      const artwork: PaisEntity = await paisRepository.save({
        nombre: faker.lorem.sentence()
      })
      paisesList.push(artwork);
    }

    cultura = await culturaRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      paises: paisesList
    })
  }

  it('Deberia estar definido', () => {
    expect(service).toBeDefined();
  });

  it('addPaisCategoria deberia agregar un pais a una cultura', async () => {
    const newPais: PaisEntity = await paisRepository.save({
      nombre: faker.company.name() 
    });

    const newCultura: CulturaEntity = await culturaRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      paises: null
    })

    const result: CulturaEntity = await service.addPaisCultura(newCultura.id, newPais.codigo);
    
    expect(result.paises).not.toBeNull();
    expect(result.paises[0].nombre).toBe(newPais.nombre)
  });

  it('addPaisCategoria deberia arrojar una excepcion por un pais invalida', async () => {
    const newCultura: CulturaEntity = await culturaRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      paises: null
    })

    await expect(() => service.addPaisCultura(newCultura.id, "0")).rejects.toHaveProperty("mensaje", "El país con el ID dado no fue encontrado");
  });

  it('addPaisCategoria deberia arrojar una excepcion por cultura invalido', async () => {
    const newPais: PaisEntity = await paisRepository.save({
      nombre: faker.company.name() 
    });

    await expect(() => service.addPaisCultura("0", newPais.codigo)).rejects.toHaveProperty("mensaje", "La cultura gastronómica con el ID dado no fue encontrada");
  });

  it('findPaisByCulturaIdPaisId deberia retornar una categoria de producto por producto', async () => {
    const pais: PaisEntity = paisesList[0];
    const storedPais: PaisEntity = await service.findPaisByCulturaIdPaisId(cultura.id, pais.codigo, )
    expect(storedPais).not.toBeNull();
    expect(storedPais.nombre).toBe(pais.nombre);
  });

  it('findPaisByCulturaIdPaisId deberia arrojar una excepcion por una categoria de producto invalida', async () => {
    await expect(()=> service.findPaisByCulturaIdPaisId(cultura.id, "0")).rejects.toHaveProperty("mensaje", "El país con el ID dado no fue encontrado"); 
  });

  it('findPaisByCulturaIdPaisId deberia arrojar una excepcion por una cultura invalido', async () => {
    const pais: PaisEntity = paisesList[0]; 
    await expect(()=> service.findPaisByCulturaIdPaisId("0", pais.codigo)).rejects.toHaveProperty("mensaje", "La cultura gastronómica con el ID dado no fue encontrado"); 
  });

  it('findPaisByCulturaIdPaisId deberia arrojar una excepcion por un pais no asociada a cultura', async () => {
    const newPais: PaisEntity = await paisRepository.save({
      nombre: faker.company.name() 
    });

    await expect(()=> service.findPaisByCulturaIdPaisId(cultura.id, newPais.codigo)).rejects.toHaveProperty("mensaje", "El pais con el ID dado no se encuentra asociado a la cultura gastronómica"); 
  });

  it('findPaisesByCulturaId deberia retornar paises por cultura', async ()=>{
    const paises: PaisEntity[] = await service.findPaisesByCulturaId(cultura.id);
    expect(paises).not.toBeNull()
  });

  it('findPaisesByCulturaId deberia arrojar una excepcion por una cultura invalida', async () => {
    await expect(()=> service.findPaisesByCulturaId("0")).rejects.toHaveProperty("mensaje", "La cultura gastronómica con el ID dado no fue encontrado"); 
  });

  it('associatePaisesCultura deberia actualizar el pais para una cultura', async () => {
    const newPais: PaisEntity = paisesList[0];

    const updatedCultura: CulturaEntity = await service.associatePaisesCultura(cultura.id, [newPais]);
    expect(updatedCultura.paises).not.toBeNull()

    expect(updatedCultura.paises[0].nombre).toBe(newPais.nombre);
  });

  it('associatePaisesCultura deberia arrojar una excepcion por una cultura invalido', async () => {
    const newPais: PaisEntity = await paisRepository.save({
      nombre: faker.company.name() 
    });

    await expect(()=> service.associatePaisesCultura("0", [newPais])).rejects.toHaveProperty("mensaje", "La cultura gastronómica con el ID dado no fue encontrado"); 
  });

  it('associatePaisesCultura deberia arrojar una escepcion por un paisinvalida', async () => {
    const newPais: PaisEntity = paisesList[0];
    newPais.codigo = "0";

    await expect(()=> service.associatePaisesCultura(cultura.id, [newPais])).rejects.toHaveProperty("mensaje", "El país con el ID dado no fue encontrado"); 
  });

  it('deletePaisCultura deberia eliminar un pais de una cultura', async () => {
    const pais: PaisEntity = paisesList[0];
    
    await service.deletePaisCultura(cultura.id, pais.codigo);

    const storedCultura: CulturaEntity = await culturaRepository.findOne({where: {id: cultura.id}, relations: ["paises"]});
    const deletedPais: PaisEntity = storedCultura.paises.find(a => a.codigo === pais.codigo);

    expect(deletedPais).toBeUndefined();

  });

  it('deletePaisCultura deberia retornar una excepcion por un pais invalida', async () => {
    await expect(()=> service.deletePaisCultura(cultura.id, "0")).rejects.toHaveProperty("mensaje", "El país con el ID dado no fue encontrado"); 
  });

  it('deletePaisCultura deberia arrojar una excepcion por una cultura invalido', async () => {
    const pais: PaisEntity = paisesList[0];
    await expect(()=> service.deletePaisCultura("0", pais.codigo)).rejects.toHaveProperty("mensaje", "La cultura gastronómica con el ID dado no fue encontrado"); 
  });

  it('deletePaisCultura deberia arrojar una excepcion por un pais no asociada', async () => {
    const newPais: PaisEntity = await paisRepository.save({
      nombre: faker.company.name() 
    });

    await expect(()=> service.deletePaisCultura(cultura.id, newPais.codigo)).rejects.toHaveProperty("mensaje", "El pais con el ID dado no se encuentra asociado a la cultura gastronómica"); 
  }); 


});

