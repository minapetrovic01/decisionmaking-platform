import { Body, Controller, Delete, Get, InternalServerErrorException, Param, Post, Put } from '@nestjs/common';
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
        try{
            const createdUser = this.userService.create(user);
            return createdUser;
        }
        catch(error)
        {
            console.error('Error creating an user:', error);
            throw new InternalServerErrorException('Error creating an user.');
        } 
    }

    @Get()
    getAll(): Promise<User[]> {
        try
        {
          const allUsers= this.userService.getAll();
          return allUsers;
        }
        catch(error)
        {
            console.error('Error returning all users:', error);
            throw new InternalServerErrorException('Error returning all users.');
        } 
    }

    @Post('/signIn')
    signIn(@Body() user: any):Promise<User|null> {
        try {
            const signedInUser = this.userService.signIn(user.email, user.password);
            console.log(signedInUser);
            return signedInUser;
          } catch (error) {
            console.error('Error signing in:', error);
            throw new InternalServerErrorException('Error signing in.');
          }
    }

    @Get(':email')
    getById(@Param('email')email: string):Promise<User> {
        try{
            const returnedUser = this.userService.getById(email);
            return returnedUser;
        }
        catch(error)
        {
            console.error('Error getting user information:', error);
            throw new InternalServerErrorException('Error getting user information.');
        } 
    }

    @Get('/unfinished/:email')
    getUnfinishedDecision(@Param('email')email: string):Promise<Decision> {

        try{
            const unfinishedDec = this.userCacheService.getUnfinishedDecision(email);
            return unfinishedDec;
        }
        catch(error)
        {
            console.error('Error getting unfinished decison information:', error);
            throw new InternalServerErrorException('Error getting unfinished decison information.');
        }
    }

    @Post('/unfinished/:email')
    setUnfinishedDecision(@Param('email')email: string, @Body() decision: Decision):Promise<void> {
        try{
            const unfinishedDec = this.userCacheService.setUnfinishedDecision(email, decision);
            return unfinishedDec;
        }
        catch(error)
        {
            console.error('Error setting unfinished decison information:', error);
            throw new InternalServerErrorException('Error setting unfinished decison information.');
        }
    }

    @Get('/supports/:email')
    getUserSupports(@Param('email')email: string):Promise<number> {

        try{
            const userSupportNumber = this.userCacheService.getUserSupports(email);
            return userSupportNumber;
        }
        catch(error)
        {
            console.error('Error getting support number of a user:', error);
            throw new InternalServerErrorException('Error getting support number of an user.');
        }
    }

    @Post('/supports/:email')
    setUserSupportsUp(@Param('email')email: string):Promise<void> {
        try{
            const userSupportNumber = this.userCacheService.setUserSupportsUp(email);
            return userSupportNumber;
        }
        catch(error)
        {
            console.error('Error increasing support number of a user:', error);
            throw new InternalServerErrorException('Error increasing support number of an user.');
        }
    }

    @Delete('/unfinished/:email')
    deleteUnfinishedDecision(@Param('email')email: string):Promise<void> {
        try 
        {
            const deleteDecision = this.userCacheService.deleteUnfinishedDecision(email);
            return deleteDecision;
        }
        catch(error)
        {
            console.error('Error deleteing an unfinished decision', error);
            throw new InternalServerErrorException('Error deleteing an unfinished decision.');
        }
    }

    @Post('/supports/down/:email')
    setUserSupportsDown(@Param('email')email: string):Promise<void> {
        try{
          const userSupportNumber =  this.userCacheService.setUserSupportsDown(email);
          return userSupportNumber;
        }
        catch(error)
        {
            console.error('Error decreasing support number of a user:', error);
            throw new InternalServerErrorException('Error decreasing support number of an user.');
        }
    }

    @Delete(':email')
    delete(@Param('email')email: string):Promise<User> {
        try{
            const deleteUser =  this.userService.delete(email);
            return deleteUser;
        }
        catch(error)
        {
            console.error('Error deleting an user:', error);
            throw new InternalServerErrorException('Error deleting an user.');
        }
    }
    
    @Put(':email')
    update(@Param('email')email: string, @Body() user: UserDto):Promise<User> {
        try{
            const updatedUser = this.userService.update(email, user);
            return updatedUser;
        }
        catch(error)
        {
            console.error('Error updating an user:', error);
            throw new InternalServerErrorException('Error updating an user.');
        }
    }
}
