import { Module } from '@nestjs/common';
import { DecisionService } from './decision.service';
import { DecisionController } from './decision.controller';
import { TagService } from 'src/tag/tag.service';
import { UserCacheService } from 'src/user-cache/user-cache.service';

@Module({
  providers: [DecisionService, TagService, UserCacheService],
  controllers: [DecisionController]
})
export class DecisionModule {}
