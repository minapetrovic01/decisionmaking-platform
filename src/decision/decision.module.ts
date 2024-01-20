import { Module } from '@nestjs/common';
import { DecisionService } from './decision.service';
import { DecisionController } from './decision.controller';
import { TagService } from 'src/tag/tag.service';
import { UserCacheService } from 'src/user-cache/user-cache.service';
import { AlternativeService } from 'src/alternative/alternative.service';
import { CriteriaService } from 'src/criteria/criteria.service';
import { UserService } from 'src/user/user.service';
import { HistoryCacheService } from 'src/history-cache/history-cache.service';

@Module({
  providers: [DecisionService, TagService, UserCacheService,AlternativeService,CriteriaService,UserService,HistoryCacheService],
  controllers: [DecisionController]
})
export class DecisionModule {}
