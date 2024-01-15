import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserService } from './user.service';
import { Neo4jModule, Neo4jService } from 'nest-neo4j/dist';

@Module({
  controllers: [UserController],
  providers: [UserService]
})
export class UserModule {}
