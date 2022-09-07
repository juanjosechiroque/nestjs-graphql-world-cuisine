import { Test, TestingModule } from '@nestjs/testing';
import { CulturaRecetaService } from './cultura-receta.service';
import { CulturaEntity } from '../cultura/cultura.entity';
import { RecetaEntity } from '../receta/receta.entity';
import { Repository } from 'typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { getRepositoryToken } from '@nestjs/typeorm';
import { faker } from '@faker-js/faker';

describe('CulturaRecetaService', () => {
  let service: CulturaRecetaService;
  let recetaRepository: Repository<RecetaEntity>;
  let culturaRepository: Repository<CulturaEntity>;
  let recetasList: RecetaEntity[];
  let cultura: CulturaEntity;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [CulturaRecetaService],
    }).compile();

    service = module.get<CulturaRecetaService>(CulturaRecetaService);
    recetaRepository = module.get<Repository<RecetaEntity>>(getRepositoryToken(RecetaEntity));
    culturaRepository = module.get<Repository<CulturaEntity>>(getRepositoryToken(CulturaEntity));

    await seedDatabase();
  });

  const seedDatabase = async () => {
    culturaRepository.clear();
    recetaRepository.clear();

    recetasList = [];
    cultura = await culturaRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      recetas: recetasList
    })

    for (let i = 0; i < 5; i++) {
      const receta: RecetaEntity = await recetaRepository.save({
        nombre: faker.lorem.sentence(),
        descripcion: faker.lorem.paragraph(),
        fotoPlato: faker.image.imageUrl(),
        procesoPreparacion: faker.lorem.sentence(),
        videoPreparacion: faker.internet.url(),
        tipoReceta: faker.lorem.word(),
        cultura: cultura
      })
      recetasList.push(receta);
    }

    cultura = await culturaRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      recetas: recetasList
    })
  }

  it('Deberia estar definido', () => {
    expect(service).toBeDefined();
  });

  it('addRecetaCategoria deberia agregar una receta a una cultura', async () => {
    const newReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      fotoPlato: faker.image.imageUrl(),
      procesoPreparacion: faker.lorem.sentence(),
      videoPreparacion: faker.internet.url(),
      tipoReceta: faker.lorem.word()
    });

    const newCultura: CulturaEntity = await culturaRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      recetas: null
    })

    const result: CulturaEntity = await service.addRecetaCategoria(newCultura.id, newReceta.codigo);

    expect(result.recetas).not.toBeNull();
    expect(result.recetas[0].nombre).toBe(newReceta.nombre)
  });

  it('addRecetaCategoria deberia arrojar una excepcion por una receta invalida', async () => {
    const newCultura: CulturaEntity = await culturaRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      recetas: null
    })

    await expect(() => service.addRecetaCategoria(newCultura.id, "0")).rejects.toHaveProperty("message", "La receta con el ID dado no fue encontrado");
  });

  it('addRecetaCategoria deberia arrojar una excepcion por cultura invalido', async () => {
    const newReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.paragraph(),
      fotoPlato: faker.image.imageUrl(),
      procesoPreparacion: faker.lorem.sentence(),
      videoPreparacion: faker.internet.url(),
      tipoReceta: faker.lorem.word(),
      cultura: cultura
    });

    await expect(() => service.addRecetaCategoria("0", newReceta.codigo)).rejects.toHaveProperty("message", "La cultura gastronómica con el ID dado no fue encontrada");
  });

  it('findRecetaByCulturaIdRecetaId deberia retornar una categoria de producto por producto', async () => {
    const pais: RecetaEntity = recetasList[0];
    const storedPais: RecetaEntity = await service.findRecetaByCulturaIdRecetaId(cultura.id, pais.codigo,)
    expect(storedPais).not.toBeNull();
    expect(storedPais.nombre).toBe(pais.nombre);
  });

  it('findRecetaByCulturaIdRecetaId deberia arrojar una excepcion por una categoria de producto invalida', async () => {
    await expect(() => service.findRecetaByCulturaIdRecetaId(cultura.id, "0")).rejects.toHaveProperty("message", "La receta con el ID dado no fue encontrado");
  });

  it('findRecetaByCulturaIdRecetaId deberia arrojar una excepcion por una cultura invalido', async () => {
    const pais: RecetaEntity = recetasList[0];
    await expect(() => service.findRecetaByCulturaIdRecetaId("0", pais.codigo)).rejects.toHaveProperty("message", "La cultura gastronómica con el ID dado no fue encontrado");
  });

  it('findRecetaByCulturaIdRecetaId deberia arrojar una excepcion por una receta no asociada a cultura', async () => {
    const newCultura: CulturaEntity = await culturaRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      recetas: null
    })

    const newReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.paragraph(),
      fotoPlato: faker.image.imageUrl(),
      procesoPreparacion: faker.lorem.sentence(),
      videoPreparacion: faker.internet.url(),
      tipoReceta: faker.lorem.word(),
      cultura: newCultura
    });

    await expect(() => service.findRecetaByCulturaIdRecetaId(cultura.id, newReceta.codigo)).rejects.toHaveProperty("message", "La receta con el ID dado no se encuentra asociado a la cultura gastronómica");
  });

  it('findRecetasByCulturaId deberia retornar recetas por cultura', async () => {
    const recetas: RecetaEntity[] = await service.findRecetasByCulturaId(cultura.id);
    expect(recetas).not.toBeNull()
  });

  it('findRecetasByCulturaId deberia arrojar una excepcion por una cultura invalida', async () => {
    await expect(() => service.findRecetasByCulturaId("0")).rejects.toHaveProperty("message", "La cultura gastronómica con el ID dado no fue encontrado");
  });

  it('associateRecetasCultura deberia actualizar la receta para una cultura', async () => {
    const newReceta: RecetaEntity = recetasList[0];

    const updatedCultura: CulturaEntity = await service.associateRecetasCultura(cultura.id, [newReceta]);
    expect(updatedCultura.recetas).not.toBeNull()

    expect(updatedCultura.recetas[0].nombre).toBe(newReceta.nombre);
  });

  it('associateRecetasCultura deberia arrojar una excepcion por una cultura invalido', async () => {
    const newReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.paragraph(),
      fotoPlato: faker.image.imageUrl(),
      procesoPreparacion: faker.lorem.sentence(),
      videoPreparacion: faker.internet.url(),
      tipoReceta: faker.lorem.word(),
      cultura: cultura
    });

    await expect(() => service.associateRecetasCultura("0", [newReceta])).rejects.toHaveProperty("message", "La cultura gastronómica con el ID dado no fue encontrado");
  });

  it('associateRecetasCultura deberia arrojar una escepcion por una receta invalida', async () => {
    const newReceta: RecetaEntity = recetasList[0];
    newReceta.codigo = "0";

    await expect(() => service.associateRecetasCultura(cultura.id, [newReceta])).rejects.toHaveProperty("message", "La receta con el ID dado no fue encontrado");
  });

  it('deleteRecetaCultura deberia eliminar una receta de una cultura', async () => {
    const pais: RecetaEntity = recetasList[0];

    await service.deleteRecetaCultura(cultura.id, pais.codigo);

    const storedCultura: CulturaEntity = await culturaRepository.findOne({ where: { id: cultura.id }, relations: ["recetas"] });
    const deletedReceta: RecetaEntity = storedCultura.recetas.find(a => a.codigo === pais.codigo);

    expect(deletedReceta).toBeUndefined();

  });

  it('deleteRecetaCultura deberia retornar una excepcion por una receta invalida', async () => {
    await expect(() => service.deleteRecetaCultura(cultura.id, "0")).rejects.toHaveProperty("message", "La receta con el ID dado no fue encontrado");
  });

  it('deleteRecetaCultura deberia arrojar una excepcion por una cultura invalido', async () => {
    const pais: RecetaEntity = recetasList[0];
    await expect(() => service.deleteRecetaCultura("0", pais.codigo)).rejects.toHaveProperty("message", "La cultura gastronómica con el ID dado no fue encontrado");
  });

  it('deleteRecetaCultura deberia arrojar una excepcion por una receta no asociada', async () => {
    const newCultura: CulturaEntity = await culturaRepository.save({
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      recetas: null
    })

    const newReceta: RecetaEntity = await recetaRepository.save({
      nombre: faker.company.name(),
      descripcion: faker.lorem.paragraph(),
      fotoPlato: faker.image.imageUrl(),
      procesoPreparacion: faker.lorem.sentence(),
      videoPreparacion: faker.internet.url(),
      tipoReceta: faker.lorem.word(),
      cultura: newCultura
    });

    await expect(() => service.deleteRecetaCultura(cultura.id, newReceta.codigo)).rejects.toHaveProperty("message", "La receta con el ID dado no se encuentra asociado a la cultura gastronómica");
  });



});


