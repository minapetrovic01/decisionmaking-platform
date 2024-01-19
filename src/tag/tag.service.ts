import { Injectable, NotFoundException } from '@nestjs/common';
import { Neo4jService } from 'nest-neo4j/dist';
import { Tag } from 'src/entities/tag';
import { TagDto } from 'src/entities/tag.dto';

@Injectable()
export class TagService {
    constructor(private readonly neo4jService: Neo4jService) {}

  async getAll(): Promise<Tag[]> {
    try{  
      const session = this.neo4jService.getReadSession();
      const result = await session.run('MATCH (t:Tag) RETURN t');
      return result.records.map(record => record.get('t').properties);
    }
    catch(error)
    {
      console.error('Error fetching tags:', error);
      throw error; 
    }
  }

  async getByName(name: string): Promise<Tag> {

    const session = this.neo4jService.getReadSession();
    const result = await session.run(
        'MATCH (t:Tag {name: $name}) RETURN t',
         { name }
    );

    if (result.records.length === 0) {
      throw new NotFoundException(`Tag with name ${name} not found`);
    }

    return result.records[0].get('t').properties;
  }

  async create(tagDto: TagDto): Promise<Tag> {
    const session = this.neo4jService.getWriteSession();
    const result = await session.run(
        'CREATE (t:Tag {name: $name}) RETURN t',
        { name: tagDto.name } 
    );
    return result.records[0].get('t').properties;
}

  async update(name: string, tag: TagDto): Promise<Tag> {

    const session = this.neo4jService.getWriteSession();
    const result = await session.run(
        'MATCH (t:Tag {name: $name}) SET t += $tag RETURN t'
        , { name, tag }
    );

    if (result.records.length === 0) {
      throw new NotFoundException(`Tag with name ${name} not found`);
    }

    return result.records[0].get('t').properties;
  }

  async delete(name: string): Promise<Tag> {
    const session = this.neo4jService.getWriteSession();
    const result = await session.run(
        'MATCH (t:Tag {name: $name}) DETACH DELETE t RETURN t',
         { name }
    );

    if (result.records.length === 0) {
      throw new NotFoundException(`Tag with name ${name} not found`);
    }

    return result.records[0].get('t').properties;
  }
  
  async findOrCreateTag(name: string): Promise<Node> {
    const session = this.neo4jService.getWriteSession();

    const existingTagResult = await session.run('MATCH (t:Tag {name: $name}) RETURN t', { name });

    if (existingTagResult.records.length > 0) {
      return existingTagResult.records[0].get('t').properties;
    }

    const newTagResult = await session.run('CREATE (t:Tag {name: $name}) RETURN t', { name });
    console.log(newTagResult);

    if (newTagResult.records.length === 0) {
      throw new NotFoundException(`Failed to create or find tag with name ${name}`);
    }

    return newTagResult.records[0].get('t').properties;
  }
}
