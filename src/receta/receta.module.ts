import { Module } from '@nestjs/common';
import { RecetaService } from './receta.service';

@Module({
  providers: [RecetaService]
})
export class RecetaModule {}
