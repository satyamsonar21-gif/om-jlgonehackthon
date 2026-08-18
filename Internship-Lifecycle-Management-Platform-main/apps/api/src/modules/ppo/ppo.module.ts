import { Module } from '@nestjs/common';
import { PpoController } from './ppo.controller';
import { PpoService } from './ppo.service';

@Module({
  controllers: [PpoController],
  providers: [PpoService],
  exports: [PpoService],
})
export class PpoModule {}
