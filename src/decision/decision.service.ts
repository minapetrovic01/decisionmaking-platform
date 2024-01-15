import { Injectable, NotFoundException } from '@nestjs/common';
import { Decision } from 'src/entities/decision';
import { DecisionDto } from 'src/entities/decision.dto';
import { Neo4jService } from 'nest-neo4j/dist';
import { TagDto } from 'src/entities/tag.dto';
@Injectable()
export class DecisionService {
    constructor(private readonly neo4jService: Neo4jService) {}
    
    async getByTag(name: string): Promise<Decision[]> {
        const session = this.neo4jService.getReadSession();
        const result = await session.run(
          `
          MATCH (d:Decision)-[:HAS]->(t:Tag {name: $name})
          RETURN ID(d) as nodeId, d
          `,
          { name }
        );
    
        const decisions:Decision[]=[];
        result.records.map(record => {
            const d:Decision={
                ...record.get('d').properties,
                id: record.get('nodeId').toNumber()
            };
            decisions.push(d);
        });
        return decisions;
    }
    
    async getByOwner(userEmail: string): Promise<Decision[]> {
        const session = this.neo4jService.getReadSession();
        const result = await session.run(
          `
          MATCH (d:Decision)<-[:OWNS]-(u:User {email: $userEmail})
          RETURN ID(d) as nodeId, d
          `,
          { userEmail }
        );
        const decisions:Decision[]=[];
        result.records.map(record => {
            const d:Decision={
                ...record.get('d').properties,
                id: record.get('nodeId').toNumber()
            };
            decisions.push(d);
        });
        return decisions;
    }
    
    async create(decisionDto: DecisionDto, tags: TagDto[], userEmail: string): Promise<Decision> {
        const session = this.neo4jService.getWriteSession();
        const result = await session.run(
          `
          MATCH (u:User {email: $userEmail})
          CREATE (d:Decision $decisionDto)-[:OWNS]->(u)
          RETURN ID(d) as nodeId, d
          `,
          { decisionDto, userEmail }
        );
        
        const createdNodeId = result.records[0].get('nodeId').toNumber();
        const createdDecision =result.records[0].get('d').properties;

        const d:Decision = {
            ...createdDecision,
            id:createdNodeId
        }
        return d;
      }
    
    async delete(id: string): Promise<Decision> {
        const session = this.neo4jService.getWriteSession();
        const result = await session.run(
          `
          MATCH (d:Decision) WHERE ID(d) = toInteger($id)
          DETACH DELETE d
          RETURN d
          `,
          { id }
        );
    
        if (result.records.length === 0) {
          throw new NotFoundException(`Decision with ID ${id} not found`);
        }
    
        return result.records[0].get('d').properties;
    }
    
    async update(id: string, decisionDto: DecisionDto): Promise<Decision> {

        const session = this.neo4jService.getWriteSession();
        const result = await session.run(
          `
          MATCH (d:Decision) WHERE ID(d) = toInteger($id)
          SET d += $decisionDto
          RETURN d
          `,
          { id, decisionDto }
        );
    
        if (result.records.length === 0) {
          throw new NotFoundException(`Decision with ID ${id} not found`);
        }
        const createdDecision =result.records[0].get('d').properties;
        const d:Decision = {
            ...createdDecision,
            id:id
        }
        return d;
      }
}
