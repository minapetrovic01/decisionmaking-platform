import { Body, Controller, InternalServerErrorException, Param, Post, Query } from '@nestjs/common';
import { CriteriaService } from './criteria.service';
import { Get } from '@nestjs/common';
import { Criteria } from 'src/entities/criteria';
import { CriteriaDto } from 'src/entities/criteria.dto';

@Controller('criteria')
export class CriteriaController {

    constructor(private criteriaService: CriteriaService) {}

    @Get()
    async getAll():Promise<Criteria[]> {
        try{
             const criteria= this.criteriaService.getAll();
             return criteria;
        }
        catch(error)
        {
          console.error('Error fetching all criterias:', error);
          throw new InternalServerErrorException('Error fetching all criterias.');
        }
    }
    @Get(':decisionId')
    async getById(@Param('decisionId')decisionId: string):Promise<Criteria[]> {
        try{
            const criteria =  this.criteriaService.getById(decisionId);
            return criteria;
        }
        catch(error)
        {
          console.error('Error fetching  all criterias for decison:', error);
          throw new InternalServerErrorException('Error getting all criterias for decison.');
        }
    }
    
    @Post()
    async create(@Body() criteriaDto: CriteriaDto, @Query('decisionId') decisionId: string):Promise<Criteria> {
        try{
            const createdCriteria = this.criteriaService.create(criteriaDto, decisionId);
            return createdCriteria;
        }
        catch(error)
        {
          console.error('Error creating criteria:', error);
          throw new InternalServerErrorException('Error creating criteria.');
        }
    }

}
