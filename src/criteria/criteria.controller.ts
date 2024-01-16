import { Body, Controller, Param, Post, Query } from '@nestjs/common';
import { CriteriaService } from './criteria.service';
import { Get } from '@nestjs/common';
import { Criteria } from 'src/entities/criteria';
import { CriteriaDto } from 'src/entities/criteria.dto';

@Controller('criteria')
export class CriteriaController {

    constructor(private criteriaService: CriteriaService) {}

    @Get()
    async getAll():Promise<Criteria[]> {
        return this.criteriaService.getAll();
    }
    @Get(':decisionId')
    async getById(@Param('decisionId')decisionId: string):Promise<Criteria[]> {
        return this.criteriaService.getById(decisionId);
    }
    
    @Post()
    async create(@Body() criteriaDto: CriteriaDto, @Query('decisionId') decisionId: string):Promise<Criteria> {
        return this.criteriaService.create(criteriaDto, decisionId);
    }

}
