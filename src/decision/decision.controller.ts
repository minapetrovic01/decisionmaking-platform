import { Body, Controller, Delete, Get, Param, Post, Put, Query } from '@nestjs/common';
import { DecisionService } from './decision.service';
import { Decision } from 'src/entities/decision';
import { DecisionDto } from 'src/entities/decision.dto';
import { DateTime } from 'neo4j-driver';

@Controller('decision')
export class DecisionController {
    constructor(private decisionService: DecisionService) {}

    @Get('/tagName/:name')
    async getByTag(@Param('name')name: string):Promise<Decision[]> {
        return null;
    }
    @Get('/owner/:userEmail')
    async getByOwner(@Param('userEmail')userEmail: string):Promise<Decision[]> {
        return null;
    }
    @Post()
    async create(@Body() decisionDto: DecisionDto, @Query('userEmail') userEmail: string):Promise<Decision> {
        return null;
    }
    @Delete(':id')
    async delete(@Param('id')id: string):Promise<Decision> {
        return null;
    }
    @Put(':id')
    async update(@Param('id')id:string, @Body() decisionDto: DecisionDto):Promise<Decision> {
        return null;
    }
}
