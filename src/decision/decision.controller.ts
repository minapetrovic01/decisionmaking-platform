import { Body, Controller, Delete, Get, InternalServerErrorException, Param, Post, Put, Query } from '@nestjs/common';
import { DecisionService } from './decision.service';
import { Decision } from 'src/entities/decision';
import { DecisionDto } from 'src/entities/decision.dto';
import { TagDto } from 'src/entities/tag.dto';

@Controller('decision')
export class DecisionController {
    constructor(private decisionService: DecisionService) {}

    @Get('/tagName/:name')
    async getByTag(@Param('name')name: string):Promise<Decision[]> {
        try{
            const decList =  this.decisionService.getByTag(name);
            return decList;
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
    async delete(@Param('id')id: string):Promise<Decision> {
        try{
            const deletedDecission = this.decisionService.delete(id);
            return deletedDecission;
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

    @Post()
    async createUnfinishedDecision(@Body() decision: Decision, @Query('userEmail') userEmail: string):Promise<Decision> {
       try{
            return null;
       }
       catch(error)
       {
         console.error('Error updating decission', error);
         throw new InternalServerErrorException('Error updating decision.');
       }
    }

    @Post()
    async deleteUnfinishedDecision(@Body() decision: Decision, @Query('userEmail') userEmail: string):Promise<Decision> {
        try{
            return null;
        }
        catch(error)
        {
          console.error('Error deleting unfinished decision', error);
          throw new InternalServerErrorException('Error deleting unfinished decision.');
        }
    }
}
