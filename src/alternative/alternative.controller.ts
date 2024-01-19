import { Body, Controller, InternalServerErrorException, Param, Post, Query } from '@nestjs/common';
import { AlternativeService } from './alternative.service';
import { Get } from '@nestjs/common';
import { Alternative } from 'src/entities/alternative';
import { AlternativeDto } from 'src/entities/alternative.dto';

@Controller('alternative')
export class AlternativeController {

    constructor(private alternativeService: AlternativeService) {}
    @Get()
    async getAll():Promise<Alternative[]> {
        try{
            const allAlternatives = this.alternativeService.getAll();
            return allAlternatives;
        }
        catch(error)
        {
          console.error('Error fetching all alternatives:', error);
          throw new InternalServerErrorException('Error fetching all alternatives.');
        }
    }
    @Get(':decisionId')
    async getById(@Param('decisionId')decisionId: string):Promise<Alternative[]> {
        try{
            const alternative = this.alternativeService.getById(decisionId);
            return alternative;
        }
        catch(error)
        {
          console.error('Error fetching an alternative:', error);
          throw new InternalServerErrorException('Error fetching an alternatives.');
        }
        
    }
    @Post()
    async create(@Body() alternativeDto: AlternativeDto, @Query('decisionId') decisionId: string):Promise<Alternative> {
        try{
            const alternative = this.alternativeService.create(alternativeDto,decisionId);
            return alternative;
        }
        catch(error)
        {
          console.error('Error creating an alternative:', error);
          throw new InternalServerErrorException('Error creating an alternative.');
        }
    }
}
