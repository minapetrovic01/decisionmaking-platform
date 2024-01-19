import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities/user';
import { UserDto } from 'src/entities/user.dto';
import { Neo4jService } from 'nest-neo4j/dist';
import { UserCacheService } from 'src/user-cache/user-cache.service';
import { Decision } from 'src/entities/decision';

@Controller('user')
export class UserController {

    constructor(private userCacheService: UserCacheService, private userService: UserService, private readonly neo4jService: Neo4jService) {}
    @Post()
    create(@Body() user: UserDto):Promise<User> {
        return this.userService.create(user);
    }
    @Get()
    getAll(): Promise<User[]> {
        return this.userService.getAll();
    }

    @Post('/signIn')
    signIn(@Body() user: any):Promise<User> {
        console.log(user);
        return this.userService.signIn(user.email, user.password);
    }

    @Get(':email')
    getById(@Param('email')email: string):Promise<User> {
        return this.userService.getById(email);
    }

    @Get('/unfinished/:email')
    getUnfinishedDecision(@Param('email')email: string):Promise<Decision> {
        return this.userCacheService.getUnfinishedDecision(email);
    }

    @Post('/unfinished/:email')
    setUnfinishedDecision(@Param('email')email: string, @Body() decision: Decision):Promise<void> {
        return this.userCacheService.setUnfinishedDecision(email, decision);
    }

    @Get('/supports/:email')
    getUserSupports(@Param('email')email: string):Promise<number> {
        return this.userCacheService.getUserSupports(email);
    }

    @Post('/supports/:email')
    setUserSupportsUp(@Param('email')email: string):Promise<void> {
        return this.userCacheService.setUserSupportsUp(email);
    }

    @Delete('/unfinished/:email')
    deleteUnfinishedDecision(@Param('email')email: string):Promise<void> {
        return this.userCacheService.deleteUnfinishedDecision(email);
    }

    @Post('/supports/down/:email')
    setUserSupportsDown(@Param('email')email: string):Promise<void> {
        return this.userCacheService.setUserSupportsDown(email);
    }

    @Delete(':email')
    delete(@Param('email')email: string):Promise<User> {
        return this.userService.delete(email);
    }
    @Put(':email')
    update(@Param('email')email: string, @Body() user: UserDto):Promise<User> {
        return this.userService.update(email, user);
    }
}
