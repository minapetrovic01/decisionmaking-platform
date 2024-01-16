import { Injectable, NotFoundException } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { Criteria } from 'src/entities/criteria';
import { CriteriaDto } from 'src/entities/criteria.dto';

@Injectable()
export class CriteriaService {
    constructor(private readonly neo4jService: Neo4jService) {}

    
    async getAll(): Promise<Criteria[]> {
        const session = this.neo4jService.getReadSession();
        const result = await session.run('MATCH (c:Criteria) RETURN c');
        return result.records.map(record => record.get('c').properties);
    }

    async getById(decisionId: string): Promise<Criteria[]> {
        const session = this.neo4jService.getReadSession();
        const result = await session.run(
            'MATCH (d:Decision)-[:DESCRIBES]->(c:Criteria) WHERE ID(d) = toInteger($decisionId) RETURN c',
            { decisionId }
        );
        return result.records.map(record => record.get('c').properties);
    }
    async create(criteriaDto: CriteriaDto, decisionId: string): Promise<Criteria> {
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

}
