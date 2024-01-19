import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GqlModule } from './gql/gql.module';
import { ConfigModule } from '@nestjs/config';
import { AlternativeModule } from './alternative/alternative.module';
import { CriteriaModule } from './criteria/criteria.module';
import { UserModule } from './user/user.module';
import { DecisionModule } from './decision/decision.module';
import { Neo4jModule } from 'nest-neo4j/dist';
import { TagModule } from './tag/tag.module';
import { HistoryCacheService } from './history-cache/history-cache.service';
import { UserCacheService } from './user-cache/user-cache.service';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    Neo4jModule.forRoot({scheme: 'neo4j', 
    host: 'localhost', 
    port: process.env.NEO4J_PORT,
    username: process.env.NEO4j_USERNAME,
    password: process.env.NEO4J_PASSWORD,
    database: 'neo4j', }),
    GqlModule, AlternativeModule, CriteriaModule, UserModule, DecisionModule, TagModule
  ],
  controllers: [AppController],
  providers: [AppService, HistoryCacheService],
})
export class AppModule {}
