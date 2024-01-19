import { Injectable, NotFoundException } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { Alternative } from 'src/entities/alternative';
import { AlternativeDto } from 'src/entities/alternative.dto';

@Injectable()
export class AlternativeService {

    constructor(private readonly neo4jService: Neo4jService) {}

    
    async getAll(): Promise<Alternative[]> {
        try{
        const session = this.neo4jService.getReadSession();
        const result = await session.run('MATCH (a:Alternative) RETURN a');
        return result.records.map(record => record.get('a').properties);
        }
        catch(error)
        {
            console.error("Error getting all alternatives");
            throw error;
        }
    }

    async getById(decisionId: string): Promise<Alternative[]> {
        try{
        const session = this.neo4jService.getReadSession();
        const result = await session.run(
            'MATCH (d:Decision)-[:IS_PART_OF]->(a:Alternative) WHERE ID(d) = toInteger($decisionId) RETURN a',
            { decisionId }
        );
        return result.records.map(record => record.get('a').properties);
        }
        catch(error)
        {
            console.error("Error fethcing alternatives for decision.");
            throw error;
        }
    }
    
    async create(alternativeDto: AlternativeDto, decisionId: string): Promise<Alternative> {
        const session = this.neo4jService.getWriteSession();
        const result = await session.run(
            'MATCH (d:Decision) WHERE ID(d) = toInteger($decisionId) CREATE (a:Alternative $alternativeDto)-[:IS_PART_OF]->(d) RETURN a',
            { alternativeDto, decisionId }
        );

        if (result.records.length === 0) {
            throw new NotFoundException('Failed to create alternative');
        }

        return result.records[0].get('a').properties;
    }    

}
