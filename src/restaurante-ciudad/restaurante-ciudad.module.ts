import { Module } from '@nestjs/common';
import { RestauranteCiudadService } from './restaurante-ciudad.service';

@Module({
  providers: [RestauranteCiudadService]
})
export class RestauranteCiudadModule {}
