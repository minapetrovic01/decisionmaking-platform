import { Body, Controller, Param, Post, Query } from '@nestjs/common';
import { AlternativeService } from './alternative.service';
import { Get } from '@nestjs/common';
import { Alternative } from 'src/entities/alternative';
import { AlternativeDto } from 'src/entities/alternative.dto';

@Controller('alternative')
export class AlternativeController {

    constructor(private alternativeService: AlternativeService) {}
    @Get()
    async getAll():Promise<Alternative[]> {
        return this.alternativeService.getAll();
    }
    @Get(':decisionId')
    async getById(@Param('decisionId')decisionId: string):Promise<Alternative[]> {
        return this.alternativeService.getById(decisionId);
    }
    @Post()
    async create(@Body() alternativeDto: AlternativeDto, @Query('decisionId') decisionId: string):Promise<Alternative> {
        return this.alternativeService.create(alternativeDto,decisionId);
    }
}
