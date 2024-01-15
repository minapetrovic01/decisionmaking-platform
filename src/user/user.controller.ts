import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities/user';
import { UserDto } from 'src/entities/user.dto';
import { Neo4jService } from 'nest-neo4j/dist';

@Controller('user')
export class UserController {

    constructor(private userService: UserService, private readonly neo4jService: Neo4jService) {}
    @Post()
    create(@Body() user: UserDto):Promise<User> {
        return this.userService.create(user);
    }
    @Get()
    getAll(): Promise<User[]> {
        return this.userService.getAll();
    }
    @Get(':email')
    getById(@Param('email')email: string):Promise<User> {
        return this.userService.getById(email);
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
