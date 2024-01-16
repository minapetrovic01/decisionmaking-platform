import { Module } from '@nestjs/common';
import { DecisionService } from './decision.service';
import { DecisionController } from './decision.controller';
import { TagService } from 'src/tag/tag.service';

@Module({
  providers: [DecisionService, TagService],
  controllers: [DecisionController]
})
export class DecisionModule {}
