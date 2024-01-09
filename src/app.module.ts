import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { GqlModule } from './gql/gql.module';
import { ConfigModule } from '@nestjs/config';
import { AlternativeModule } from './alternative/alternative.module';
import { CriteriaModule } from './criteria/criteria.module';
import { UserModule } from './user/user.module';
import { DecisionModule } from './decision/decision.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }), 
    GqlModule, AlternativeModule, CriteriaModule, UserModule, DecisionModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
