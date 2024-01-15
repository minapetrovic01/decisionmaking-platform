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

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    Neo4jModule.forRoot({scheme: 'neo4j', // or 'neo4j'
    host: 'localhost', // Neo4j server host
    port: 7687,
    username: 'neo4j',
    password: 'minamina',
    database: 'neo4j', }),
    GqlModule, AlternativeModule, CriteriaModule, UserModule, DecisionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
