import { Injectable, InternalServerErrorException, NotFoundException } from '@nestjs/common';
import { Decision } from 'src/entities/decision';
import { DecisionDto } from 'src/entities/decision.dto';
import { Neo4jService } from 'nest-neo4j/dist';
import { TagDto } from 'src/entities/tag.dto';
import { TagService } from 'src/tag/tag.service';
import { AlternativeService } from 'src/alternative/alternative.service';
import { CriteriaService } from 'src/criteria/criteria.service';
import { UserService } from 'src/user/user.service';
import { HistoryCacheService } from 'src/history-cache/history-cache.service';
@Injectable()
export class DecisionService {
    constructor(private readonly neo4jService: Neo4jService, 
        private alternativeService:AlternativeService, 
        private criteriaService:CriteriaService,
        private userService: UserService,
        private historyCacheService:HistoryCacheService) {}
    
    async getByTag(name: string,email:string): Promise<Decision[]> {
        const session = this.neo4jService.getReadSession();
        const result = await session.run(
          `
          MATCH (d:Decision)-[:HAS]->(t:Tag {name: $name})
          OPTIONAL MATCH (d:Decision)<-[:OWNS]-(u:User)
          RETURN ID(d) as nodeId, d, u
          `,
          { name }
        );

        if (result.records.length === 0) {
            return [];
        }
        const decisions: Decision[] = [];
        await Promise.all(
            result.records.map(async (record) => {
                const d: Decision = {
                    ...record.get('d').properties,
                    id: record.get('nodeId').toNumber(),
                    owner: {...record.get('u').properties}
                };
    
                const criteria = await this.criteriaService.getById(d.id.toString());
                d.criterias = criteria;
    
                const alternatives = await this.alternativeService.getById(d.id.toString());
                d.alternatives = alternatives;

                const owner=await this.userService.getById(d.owner.email);
                d.owner.supportNumber=owner.supportNumber;
    
                decisions.push(d);
            })
        );

        if(decisions.length>0)
            this.historyCacheService.setHistory(email, decisions);

        return decisions;
        
    }
    
    async getByOwner(userEmail: string): Promise<Decision[]> {
        try{

        const session = this.neo4jService.getReadSession();
        const result = await session.run(
          `
          MATCH (d:Decision)<-[:OWNS]-(u:User {email: $userEmail})
          OPTIONAL MATCH (d:Decision)<-[:OWNS]-(u:User)
          RETURN ID(d) as nodeId, d,u
          `,
          { userEmail }
        );

        const decisions: Decision[] = [];
        await Promise.all(
            result.records.map(async (record) => {
                const d: Decision = {
                    ...record.get('d').properties,
                    id: record.get('nodeId').toNumber(),
                    owner: {...record.get('u').properties}

                };
    
                const criteria = await this.criteriaService.getById(d.id.toString());
                d.criterias = criteria;
    
                const alternatives = await this.alternativeService.getById(d.id.toString());
                d.alternatives = alternatives;

                decisions.push(d);
            })
        );

        return decisions;
     }
     catch(error)
     {
        console.error("Error with finding owners decisions", error);
        throw error;
     }
    }
    
    async create(decisionDto: DecisionDto, tags: TagDto[], userEmail: string): Promise<Decision> {
        const session = this.neo4jService.getWriteSession();
        const result = await session.run(
            `
            MATCH (u:User {email: $userEmail})
            CREATE (d:Decision $decisionDto)<-[:OWNS]-(u)
            RETURN ID(d) as nodeId, d
            `,
            { decisionDto, userEmail }
        );
        if(result.records.length === 0)
            throw new InternalServerErrorException(`Error creating decision.`);

        const createdNodeId = result.records[0].get('nodeId').toNumber();
        const createdDecision = result.records[0].get('d').properties;



        const d: Decision = {
            ...createdDecision,
            id: createdNodeId
        };
    
        for (const tagDto of tags) {
            const tagName = tagDto.name;
    
            const tagNodeResult = await session.run(
                `
                MATCH (t:Tag {name: $tagName})
                RETURN t
                `,
                { tagName }
            );
    
            if (tagNodeResult.records.length > 0) {
                const res=await session.run(
                    `
                    MATCH (d:Decision) WHERE ID(d) = $decisionId
                    MATCH (t:Tag {name: $tagName})
                    MERGE (d)-[:HAS]->(t)
                    `,
                    { decisionId: createdNodeId, tagName }
                );
            } 
            else {
                    const newTagResult = await session.run(
                    `
                    CREATE (t:Tag {name: $tagName})
                    RETURN t
                    `,
                    { tagName }
                );
    
                const newTagNode = await newTagResult.records[0].get('t').properties;
                await session.run(
                    `
                    MATCH (d:Decision) WHERE ID(d) = $decisionId
                    MATCH (t:Tag {name: $tagName})
                    MERGE (d)-[:HAS]->(t)
                    `,
                    { decisionId: createdNodeId, tagName }
                );
            }
        }
    
        return d;
    }
    
    async delete(id: string): Promise<void> {
        try{

        
        const session = this.neo4jService.getWriteSession();
        const result = await session.run(
          `
          MATCH (d:Decision) WHERE ID(d) = toInteger($id)
          OPTIONAL MATCH (u )-[:OWNS]->(d:Decision)<-[:IS_PART_OF]-(a:Alternative)
          OPTIONAL MATCH (u)-[:OWNS]->(d)<-[:DESCRIBES]-(c:Criteria)
          DETACH DELETE u, d, a, c
          `,
          { id }
        );

    }
    catch(error)
    {
        console.error("Error when deleting decision.");
        error.throw();
    }
    
        return;
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
