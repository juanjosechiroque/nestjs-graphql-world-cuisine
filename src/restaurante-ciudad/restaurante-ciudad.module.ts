import { Module } from '@nestjs/common';
import { RestauranteCiudadService } from './restaurante-ciudad.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RestauranteEntity } from '../restaurante/restaurante.entity';
import { CiudadEntity } from '../ciudad/ciudad.entity';
import { RestauranteCiudadController } from './restaurante-ciudad.controller';

@Module({
  imports: [TypeOrmModule.forFeature([RestauranteEntity, CiudadEntity])],
  providers: [RestauranteCiudadService],
  controllers: [RestauranteCiudadController]
})
export class RestauranteCiudadModule {}
