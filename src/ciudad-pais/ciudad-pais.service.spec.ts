import { Test, TestingModule } from '@nestjs/testing';
import { CiudadPaisService } from './ciudad-pais.service';

describe('CiudadPaisService', () => {
  let service: CiudadPaisService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CiudadPaisService],
    }).compile();

    service = module.get<CiudadPaisService>(CiudadPaisService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
