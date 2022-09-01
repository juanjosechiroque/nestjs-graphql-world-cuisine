/* eslint-disable prettier/prettier */
import { TypeOrmModule } from '@nestjs/typeorm';
import { CategoriaproductoEntity } from '../../categoriaproducto/categoriaproducto.entity';
import { CiudadEntity } from '../../ciudad/ciudad.entity';
import { CulturaEntity } from '../../cultura/cultura.entity';
import { PaisEntity } from '../../pais/pais.entity';
import { ProductoEntity } from '../../producto/producto.entity';
import { RecetaEntity } from '../../receta/receta.entity';
import { RestauranteEntity } from '../../restaurante/restaurante.entity';

export const TypeOrmTestingConfig = () => [
  TypeOrmModule.forRoot({
    type: 'sqlite',
    database: ':memory:',
    dropSchema: true,
    entities: [CategoriaproductoEntity, CiudadEntity, CulturaEntity, PaisEntity, ProductoEntity, RecetaEntity, RestauranteEntity],
    synchronize: true,
    keepConnectionAlive: true 
  }),
  TypeOrmModule.forFeature([CategoriaproductoEntity, CiudadEntity, CulturaEntity, PaisEntity, ProductoEntity, RecetaEntity, RestauranteEntity]),
];
