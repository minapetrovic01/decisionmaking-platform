import { Injectable, NotFoundException } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { Criteria } from 'src/entities/criteria';
import { CriteriaDto } from 'src/entities/criteria.dto';

@Injectable()
export class CriteriaService {
    constructor(private readonly neo4jService: Neo4jService) {}

    
    async getAll(): Promise<Criteria[]> {
        try{
        const session = this.neo4jService.getReadSession();
        const result = await session.run('MATCH (c:Criteria) RETURN c');
        return result.records.map(record => record.get('c').properties);
        }
        catch(error)
        {
            console.error("Error getting all criterias", error);
            throw error;
        }
    }

    async getById(decisionId: string): Promise<Criteria[]> {
        try{
        const session = this.neo4jService.getReadSession();
        const result = await session.run(
            'MATCH (d:Decision)<-[:DESCRIBES]-(c:Criteria) WHERE ID(d) = toInteger($decisionId) RETURN c',
            { decisionId }
        );
        return result.records.map(record => record.get('c').properties);
        }
        catch(error)
        {
            console.error("Error fetching criteria", error);
            throw error;
        }
    }
    async create(criteriaDto: CriteriaDto, decisionId: string): Promise<Criteria> {
        try{
            const session = this.neo4jService.getWriteSession();
            const result = await session.run(
                'MATCH (d:Decision) WHERE ID(d) = toInteger($decisionId) CREATE (c:Criteria $criteriaDto)-[:DESCRIBES]->(d) RETURN c',
                { criteriaDto, decisionId }
            );

            if (result.records.length === 0) {
                throw new NotFoundException('Failed to create criteria');
            }

            return result.records[0].get('c').properties;
        }
        catch(error)
        {
            console.error("Error creating criteria", error);
            throw error;
        }
    }    

}
