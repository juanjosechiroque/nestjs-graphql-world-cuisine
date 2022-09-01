import { Module } from '@nestjs/common';
import { CiudadPaisService } from './ciudad-pais.service';

@Module({
  providers: [CiudadPaisService]
})
export class CiudadPaisModule {}
