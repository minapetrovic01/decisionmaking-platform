import { Body, Controller, Delete, Get, Param, Post, Put } from '@nestjs/common';
import { UserService } from './user.service';
import { User } from 'src/entities/user';
import { UserDto } from 'src/entities/user.dto';

@Controller('user')
export class UserController {

    constructor(private userService: UserService) {}
    @Post()
    create(@Body() user: UserDto):Promise<User> {
        return null;
    }
    @Get()
    getAll(): Promise<User[]> {
        return null;
    }
    @Get(':email')
    getById(@Param('email')email: string):Promise<User> {
        return null;
    }
   
    @Delete(':email')
    delete(@Param('email')email: string):Promise<User> {
        return null;
    }
    @Put(':email')
    update(@Param('email')email: string, @Body() user: UserDto):Promise<User> {
        return null;
    }
}
