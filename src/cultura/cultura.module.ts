import { Module } from '@nestjs/common';
import { CulturaService } from './cultura.service';

@Module({
  providers: [CulturaService]
})
export class CulturaModule {}
