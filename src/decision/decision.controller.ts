import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { DecisionService } from './decision.service';
import { Decision } from 'src/entities/decision';
import { DecisionDto } from 'src/entities/decision.dto';
import { TagDto } from 'src/entities/tag.dto';

@Controller('decision')
export class DecisionController {
    constructor(private decisionService: DecisionService) {}

    @Get('/tagName/:name')
    async getByTag(@Param('name')name: string):Promise<Decision[]> {
        return this.decisionService.getByTag(name);
    }
    @Get('/owner/:userEmail')
    async getByOwner(@Param('userEmail')userEmail: string):Promise<Decision[]> {
        return this.decisionService.getByOwner(userEmail);
    }
    @Post()
    async create(@Body() requestBody: { decisionDto: DecisionDto, tags: TagDto[] }, @Query('userEmail') userEmail: string):Promise<Decision> {
        return this.decisionService.create(requestBody.decisionDto,requestBody.tags,userEmail);
    }
    @Delete(':id')
    async delete(@Param('id')id: string):Promise<Decision> {
        return this.decisionService.delete(id);
    }
    @Put(':id')
    async update(@Param('id')id:string, @Body() decisionDto: DecisionDto):Promise<Decision> {
        return this.decisionService.update(id,decisionDto);
    }
}
