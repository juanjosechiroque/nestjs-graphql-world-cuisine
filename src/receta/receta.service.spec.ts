import { Test, TestingModule } from '@nestjs/testing';
import { RecetaService } from './receta.service';
import { RecetaEntity } from './receta.entity';
import { Repository } from 'typeorm';
import { faker } from '@faker-js/faker';
import { getRepositoryToken } from '@nestjs/typeorm';
import { TypeOrmTestingConfig } from '../shared/testing-utils/typeorm-testing-config';
import { CulturaEntity } from '../cultura/cultura.entity';

describe('RecetaService', () => {
  let service: RecetaService;
  let repository: Repository<RecetaEntity>;
  let listaRecetas: RecetaEntity[];

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [...TypeOrmTestingConfig()],
      providers: [RecetaService],
    }).compile();

    service = module.get<RecetaService>(RecetaService);
    repository = module.get<Repository<RecetaEntity>>(getRepositoryToken(RecetaEntity));
    await seedDatabase();    
  });

  const seedDatabase = async () => {
    repository.clear();
    listaRecetas = [];
    for(let i = 0; i < 5; i++){
        const receta: RecetaEntity = await repository.save({
        nombre: faker.lorem.sentence(),
        descripcion: faker.lorem.paragraph(),
        fotoPlato: faker.image.imageUrl(),
        procesoPreparacion: faker.lorem.sentence(),
        videoPreparacion: faker.internet.url(),
        tipoReceta: faker.lorem.word()
        })
        listaRecetas.push(receta);
    }
  }  

  it('Deberia estar definido', () => {
    expect(service).toBeDefined();
  });

  it('findAll deberia retornar todas las recetas', async () => {
    const recetas: RecetaEntity[] = await service.findAll();
    expect(recetas).not.toBeNull();
    expect(recetas).toHaveLength(listaRecetas.length);
  });  

  it('findOne deberia retornar una receta por ID', async () => {
    const recetaAlmacenada: RecetaEntity = listaRecetas[0];
    const receta: RecetaEntity = await service.findOne(recetaAlmacenada.codigo);
    expect(receta).not.toBeNull();
    expect(receta.nombre).toEqual(recetaAlmacenada.nombre)
    expect(receta.descripcion).toEqual(recetaAlmacenada.descripcion)
    expect(receta.fotoPlato).toEqual(recetaAlmacenada.fotoPlato)
    expect(receta.procesoPreparacion).toEqual(recetaAlmacenada.procesoPreparacion)
    expect(receta.videoPreparacion).toEqual(recetaAlmacenada.videoPreparacion)
    expect(receta.tipoReceta).toEqual(recetaAlmacenada.tipoReceta)
  }); 

  it('findOne deberia arrojar una excepcion por una receta invalida', async () => {
    await expect(() => service.findOne("0")).rejects.toHaveProperty("mensaje", "La receta con el ID dado no fue encontrada")
  });  

  /*it('create deberia retornar una nueva receta', async () => {
    const receta: RecetaEntity = {
      codigo: "",
      nombre: faker.lorem.sentence(),
      descripcion: faker.lorem.paragraph(),
      fotoPlato: faker.image.imageUrl(),
      procesoPreparacion: faker.lorem.sentence(),
      videoPreparacion: faker.internet.url(),
      tipoReceta: faker.lorem.word(),
      cultura: {id:"1",
      nombre:faker.lorem.sentence(),
      descripcion:faker.lorem.paragraph(),
      recetas: []}
  }

    const nuevaReceta: RecetaEntity = await service.create(receta);
    expect(nuevaReceta).not.toBeNull();

    const recetaAlmacenada: RecetaEntity = await repository.findOne({where: {codigo: nuevaReceta.codigo}})
    expect(recetaAlmacenada).not.toBeNull();
    expect(recetaAlmacenada.nombre).toEqual(nuevaReceta.nombre)
    expect(recetaAlmacenada.descripcion).toEqual(nuevaReceta.descripcion)
    expect(recetaAlmacenada.fotoPlato).toEqual(nuevaReceta.fotoPlato)
    expect(recetaAlmacenada.procesoPreparacion).toEqual(nuevaReceta.procesoPreparacion)
    expect(recetaAlmacenada.videoPreparacion).toEqual(nuevaReceta.videoPreparacion)
    expect(recetaAlmacenada.tipoReceta).toEqual(nuevaReceta.tipoReceta)
  });  */

  it('update deberia modificar una receta', async () => {
    const receta: RecetaEntity = listaRecetas[0];
    receta.nombre = "New name";
    receta.descripcion = "New description";
    receta.fotoPlato = "New photo";
    receta.procesoPreparacion = "New process";
    receta.videoPreparacion = "New video";
    receta.tipoReceta = "New recipe type";
  
    const recetaActualizado: RecetaEntity = await service.update(receta.codigo, receta);
    expect(recetaActualizado).not.toBeNull();
  
    const recetaAlmacenada: RecetaEntity = await repository.findOne({ where: { codigo: receta.codigo } })
    expect(recetaAlmacenada).not.toBeNull();
    expect(recetaAlmacenada.nombre).toEqual(receta.nombre)
    expect(recetaAlmacenada.descripcion).toEqual(receta.descripcion)
    expect(recetaAlmacenada.fotoPlato).toEqual(receta.fotoPlato)
    expect(recetaAlmacenada.procesoPreparacion).toEqual(receta.procesoPreparacion)
    expect(recetaAlmacenada.videoPreparacion).toEqual(receta.videoPreparacion)
    expect(recetaAlmacenada.tipoReceta).toEqual(receta.tipoReceta)
  });

  it('update deberia arrojar una excepcion por una receta invalida', async () => {
    let receta: RecetaEntity = listaRecetas[0];
    receta = {
      ...receta, nombre: "New name"
    }
    await expect(() => service.update("0", receta)).rejects.toHaveProperty("mensaje", "La receta con el ID dado no fue encontrada")
  });  

  it('delete deberia eliminar una receta', async () => {
    const receta: RecetaEntity = listaRecetas[0];
    await service.delete(receta.codigo);
  
    const recetaBorrado: RecetaEntity = await repository.findOne({ where: { codigo: receta.codigo } })
    expect(recetaBorrado).toBeNull();
  });

  it('delete deberia arrojar una excepcion por una receta invalida', async () => {
    const receta: RecetaEntity = listaRecetas[0];
    await service.delete(receta.codigo);
    await expect(() => service.delete("0")).rejects.toHaveProperty("mensaje", "La receta con el ID dado no fue encontrada")
  });

});
