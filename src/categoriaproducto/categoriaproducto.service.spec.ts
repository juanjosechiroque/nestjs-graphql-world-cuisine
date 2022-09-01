import { Test, TestingModule } from '@nestjs/testing';
import { CategoriaproductoService } from './categoriaproducto.service';

describe('CategoriaproductoService', () => {
  let service: CategoriaproductoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoriaproductoService],
    }).compile();

    service = module.get<CategoriaproductoService>(CategoriaproductoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
