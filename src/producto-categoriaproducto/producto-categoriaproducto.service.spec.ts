import { Test, TestingModule } from '@nestjs/testing';
import { ProductoCategoriaproductoService } from './producto-categoriaproducto.service';

describe('ProductoCategoriaproductoService', () => {
  let service: ProductoCategoriaproductoService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [ProductoCategoriaproductoService],
    }).compile();

    service = module.get<ProductoCategoriaproductoService>(ProductoCategoriaproductoService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
