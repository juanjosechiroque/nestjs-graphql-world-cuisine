import { Test, TestingModule } from '@nestjs/testing';
import { RestauranteCiudadService } from './restaurante-ciudad.service';

describe('RestauranteCiudadService', () => {
  let service: RestauranteCiudadService;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [RestauranteCiudadService],
    }).compile();

    service = module.get<RestauranteCiudadService>(RestauranteCiudadService);
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
  });
});
