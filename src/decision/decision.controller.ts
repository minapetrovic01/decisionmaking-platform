import { Body, Controller, Delete, Get, InternalServerErrorException, Param, Post, Put, Query } from '@nestjs/common';
import { DecisionService } from './decision.service';
import { Decision } from 'src/entities/decision';
import { DecisionDto } from 'src/entities/decision.dto';
import { TagDto } from 'src/entities/tag.dto';
import { UserCacheService } from 'src/user-cache/user-cache.service';
import { HistoryCacheService } from 'src/history-cache/history-cache.service';

@Controller('decision')
export class DecisionController {
    constructor(private decisionService: DecisionService, private userCacheService: UserCacheService,private historyCacheService:HistoryCacheService) {}

    @Get('/tagName/:name/:email')
    async getByTag(@Param('name')name: string,@Param('email')email: string):Promise<Decision[]> {
        try{
            return this.decisionService.getByTag(name,email);
            
        }
        catch(error)
        {
          console.error('Error getting all decisons by tag:', error);
          throw new InternalServerErrorException('Error getting all decisons by tag.');
        }
    }
    
    @Get('/owner/:userEmail')
    async getByOwner(@Param('userEmail')userEmail: string):Promise<Decision[]> {
        try{
            const decList = this.decisionService.getByOwner(userEmail);
            return decList;
        }
        catch(error)
        {
          console.error('Error getting all decisons from owner:', error);
          throw new InternalServerErrorException('Error getting all decisons from owner.');
        }
    }

    @Get('/cached/:userEmail')
    async getCachedDecisions(@Param('userEmail')userEmail: string):Promise<Decision[]> {
        try{
            const decList = this.historyCacheService.getHistory(userEmail);
            return decList;
        }
        catch(error)
        {
          console.error('Error getting all cached decisons from owner:', error);
          throw new InternalServerErrorException('Error getting all  cached decisons from owner.');
        }
    }

    @Delete('/cached/:email')
    deleteCachedDecisions(@Param('email')email: string):Promise<void> {
        try 
        {
            const deleteDecision = this.historyCacheService.deleteHistory(email);
            return deleteDecision;
        }
        catch(error)
        {
            console.error('Error deleteing an cached decisions', error);
            throw new InternalServerErrorException('Error deleteing an cached decisions.');
        }
    }


    @Post()
    async create(@Body() requestBody: { decisionDto: DecisionDto, tags: TagDto[] }, @Query('userEmail') userEmail: string):Promise<Decision> {
        try{
            const createdDecision = this.decisionService.create(requestBody.decisionDto,requestBody.tags,userEmail);
            return createdDecision;
        }
        catch(error)
        {
          console.error('Error creating decission', error);
          throw new InternalServerErrorException('Error creating decission.');
        }
    }

    @Delete(':id')
    async delete(@Param('id')id: string):Promise<void> {
        try{
            const deletedDecission = this.decisionService.delete(id);
            return;
        }
        catch(error)
        {
          console.error('Error deleting decission', error);
          throw new InternalServerErrorException('Error deleting decission.');
        }
    }

    @Put(':id')
    async update(@Param('id')id:string, @Body() decisionDto: DecisionDto):Promise<Decision> {
       try{
             const updatedDecison =  this.decisionService.update(id,decisionDto);
             return updatedDecison;
       }
       catch(error)
       {
         console.error('Error updating decission', error);
         throw new InternalServerErrorException('Error updating decission.');
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
}
