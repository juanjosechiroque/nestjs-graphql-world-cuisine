import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { RestauranteModule } from './restaurante/restaurante.module';
import { CiudadModule } from './ciudad/ciudad.module';
import { PaisModule } from './pais/pais.module';
import { CulturaModule } from './cultura/cultura.module';
import { RecetaModule } from './receta/receta.module';
import { ProductoModule } from './producto/producto.module';
import { CategoriaproductoModule } from './categoriaproducto/categoriaproducto.module';
import { CulturaPaisModule } from './cultura-pais/cultura-pais.module';
import { CulturaProductoModule } from './cultura-producto/cultura-producto.module';
import { CulturaRecetaModule } from './cultura-receta/cultura-receta.module';
import { CulturaRestauranteModule } from './cultura-restaurante/cultura-restaurante.module';
import { PaisCiudadModule } from './pais-ciudad/pais-ciudad.module';
import { CiudadPaisModule } from './ciudad-pais/ciudad-pais.module';
import { ProductoCategoriaproductoModule } from './producto-categoriaproducto/producto-categoriaproducto.module';
import { RestauranteCiudadModule } from './restaurante-ciudad/restaurante-ciudad.module';
import { CategoriaproductoEntity } from './categoriaproducto/categoriaproducto.entity';
import { CiudadEntity } from './ciudad/ciudad.entity';
import { CulturaEntity } from './cultura/cultura.entity';
import { PaisEntity } from './pais/pais.entity';
import { ProductoEntity } from './producto/producto.entity';
import { RecetaEntity } from './receta/receta.entity';
import { RestauranteEntity } from './restaurante/restaurante.entity';

@Module({
  imports: [RestauranteModule, CiudadModule, PaisModule,
    CulturaModule, RecetaModule, ProductoModule, CategoriaproductoModule,
    CulturaPaisModule, CulturaProductoModule, CulturaRecetaModule,
    CulturaRestauranteModule, PaisCiudadModule, CiudadPaisModule,
    ProductoCategoriaproductoModule, RestauranteCiudadModule,
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'cultura',
      entities: [CategoriaproductoEntity, CiudadEntity, CulturaEntity, PaisEntity, ProductoEntity, RecetaEntity, RestauranteEntity],
      dropSchema: true,
      synchronize: true,
      keepConnectionAlive: true
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
